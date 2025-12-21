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
        $logs = $task->logs()->with('user')->latest()->get();
        return response()->json([
            'success' => true,
            'task_id' => $task->id,
            'logs' => $logs
        ]);
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

}