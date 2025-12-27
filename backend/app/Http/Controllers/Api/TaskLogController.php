<?php


namespace App\Http\Controllers\Api;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\TaskLog;
use Illuminate\Support\Facades\Auth;

class TaskLogController
{
	public function index($taskId){
        $task = Task::findOrFail($taskId);
        $logs = $task->logs()->with('user')->orderBy('work_date','desc')->get();
        return response()->json([
            'success' => true,
            'task_id' => $task->id,
            'logs' => $logs
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id'   => 'required|exists:tasks,id',
            'work_date' => 'required|date',
            'hours'     => 'required|numeric|min:0.25|max:24',
            'comment'   => 'nullable|string',
            'progress'  => 'required|integer|min:0|max:100',
        ]);

        $log = TaskLog::create([
            'task_id'   => $validated['task_id'],
            'user_id'   => Auth::id(),
            'work_date' => $validated['work_date'],
            'hours'     => $validated['hours'],
            'comment'   => $validated['comment'],
            'progress'  => $validated['progress'],
            'status'    => 'pending',
        ]);

        if ($validated['progress'] == 100) {
            $log->task->update(['status' => 'completed']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Task log submitted successfully',
            'log' => $log
        ], 201);
    }

    public function update(Request $request, $id){
    
        $log = TaskLog::findOrFail($id);
        $user = Auth::user();

        if ($log->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized to update this log'
            ], 403);
        }

        $validated = $request->validate([
            'comment' => 'sometimes|string',
            'progress' => 'sometimes|integer|min:0|max:100',
        ]);

        $log->update($validated);

        if (isset($validated['progress']) && $validated['progress'] == 100) {
            $log->task->update(['status' => 'completed']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Log updated successfully',
            'log' => $log->fresh()
        ]);
    }



     public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Admin access required'
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $log = TaskLog::findOrFail($id);
        $log->status = $validated['status'];
        $log->save();

        return response()->json([
            'success' => true,
            'message' => 'Task log status updated',
            'log' => $log
        ]);
    }


    public function destroy($id){

        $log = TaskLog::findOrFail($id);
        $user = Auth::user();

        if ($log->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized to delete this log'
            ], 403);
        }
        $log->delete();

        return response()->json([
            'success' => true,
            'message' => 'Log deleted successfully'
        ]);
    }


     public function myLogs()
    {
        $logs = TaskLog::with('task.project')
            ->where('user_id', Auth::id())
            ->orderBy('work_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'logs' => $logs
        ]);
    }

    public function pendingLogs()
{
    $user = Auth::user();
    if ($user->role !== 'manager' && $user->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $logs = TaskLog::where('status', 'pending')
        ->with(['task', 'user'])
        ->latest()
        ->get();

    return response()->json([
        'success' => true,
        'logs' => $logs
    ]);
}

    public function approveLogs(Request $request, $id)
{
    $user = Auth::user();
    if ($user->role !== 'manager' && $user->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $request->validate([
        'status' => 'required|in:approved,rejected'
    ]);

    $log = TaskLog::findOrFail($id);
    $log->status = $request->status;
    $log->save();

    return response()->json([
        'success' => true,
        'message' => 'Log updated',
        'log' => $log
    ]);
}

}