<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Milestone;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    public function show($id): JsonResponse
    {
        $user = Auth::user();

        
        $milestone = Milestone::with('project')->findOrFail($id);

        $project = $milestone->project;

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
            if (!$project->employees()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        elseif ($user->role === 'intern') {
            if (!$project->interns()->where('intern_id', $user->id)->exists()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
            
        return response()->json([
            'success' => true,
            'data' => $milestone
        ]);
    }

    public function update(Request $request, $id): JsonResponse{
        $user = Auth::user();

        $milestone = Milestone::with('project')->findOrFail($id);
        $project = $milestone->project;

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
        }else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|required|date|after_or_equal:today',
            'status' => ['sometimes', 'required', Rule::in(['pending','in_progress','completed'])]
        ]);

    
        $milestone->update($validated);

    
        return response()->json([
            'success' => true,
            'message' => 'Milestone updated successfully',
            'data' => $milestone->fresh()->load('project') // reload project relationship
        ]);
    }

    public function destroy($id): JsonResponse{
        $user = Auth::user();

    
        $milestone = Milestone::with('project')->findOrFail($id);
        $project = $milestone->project;

        if (in_array($user->role, ['admin', 'HR_manager'])) {
        }elseif ($user->role === 'department_manager') {
            if ($project->department_id !== $user->department_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }elseif ($user->role === 'project_manager') {
            if ($project->manager_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $milestone->delete();

        return response()->json([
            'success' => true,
            'message' => 'Milestone deleted successfully'
            ]);
    }

}

