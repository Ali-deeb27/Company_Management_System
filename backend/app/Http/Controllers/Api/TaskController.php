<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use App\Models\TaskLog;

class TaskController extends Controller
{
    public function show($id): JsonResponse{
        $user = Auth::user();
        $task = Task::with(['assignee', 'project'])->findOrFail($id);
        $project = $task->project;

    
        if (in_array($user->role, ['admin', 'HR_manager'])) {
        }elseif ($user->role === 'department_manager') {
            if ($project->department_id !== $user->department_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }elseif ($user->role === 'project_manager') {
            if ($project->manager_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }elseif ($user->role === 'employee') {
            if ($task->assignee_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }elseif ($user->role === 'intern') {
            if (!$project->interns()->where('intern_id', $user->id)->exists()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json([
            'success' => true,
            'data' => $task
        ]);
    }

    public function update(Request $request, $id): JsonResponse{
        $user = Auth::user();
        $task = Task::with('project')->findOrFail($id);
        $project = $task->project;

    
        if (in_array($user->role, ['admin', 'HR_manager'])) {
        }elseif ($user->role === 'department_manager') {
            if ($project->department_id !== $user->department_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }elseif ($user->role === 'project_manager') {
            if($project->manager_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'assignee_id' => 'sometimes|required|integer|exists:users,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['sometimes','required', Rule::in(['pending','in_progress','completed'])],
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
        ]);

        $task->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task->fresh()->load('assignee', 'project')
        ]);
    }

    public function destroy($id): JsonResponse{
        
        $user = Auth::user();
        $task = Task::with('project')->findOrFail($id);
        $project = $task->project;

        if (in_array($user->role, ['admin', 'HR_manager'])) { 
            }elseif ($user->role === 'department_manager') {
                if ($project->department_id !== $user->department_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
                }
            } 
            elseif ($user->role === 'project_manager') {
                if ($project->manager_id !== $user->id) {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
            } 
        else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        $task->delete();

    
        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }

    
    public function storeLog(Request $request, $id){
        
        $user = Auth::user();
        $task = Task::with('project')->findOrFail($id);
        $project = $task->project;

        if (in_array($user->role, ['admin', 'HR_manager'])) {
        }elseif ($user->role === 'department_manager') {
            if ($project->department_id !== $user->department_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        elseif ($user->role === 'project_manager') {
            if ($project->manager_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        elseif ($user->role === 'employee') {
            if ($task->assignee_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string',
            'progress' => 'required|integer|min:0|max:100'
        ]);

        $log = TaskLog::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'comment' => $validated['comment'],
            'progress' => $validated['progress'],
        ]);

        if ($validated['progress'] === 100) {
            $task->update(['status' => 'completed']);
        }elseif ($validated['progress'] > 0) {
            $task->update(['status' => 'in_progress']);
        }
        return response()->json([
            'success' => true,
            'message' => 'Task progress logged successfully',
            'data' => $log->load('user')
        ], 201);
    }
}
