<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Intern;
use App\Models\Employee;
use App\Models\Milestone;
use Illuminate\Validation\Rule;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskAssignedNotification;

class ProjectController extends Controller
{
    public function index(): JsonResponse{
         $allowedRoles = [
            'admin',
            'HR_manager',
            'department_manager',
            'project_manager',
            'employee',
            'intern'
        ];

        if (!in_array(Auth::user()->role, $allowedRoles)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $projects = Project::with('department')->get();

        return response()->json([
            'count' => $projects->count(),
            'projects' => $projects
        ]);
    }

    public function store(Request $request): JsonResponse{
        $authUser = Auth::user();

        $allowedRoles = ['admin', 'department_manager', 'project_manager'];

        if (!in_array($authUser->role, $allowedRoles)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'budget' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|in:planned,active,completed,on_hold',
        ]);

        if (
        $authUser->role === 'department_manager' &&
        $authUser->department_id != $validated['department_id']
        ){
            return response()->json([
                'message' => 'You can only create projects in your own department'
            ], 403);
        }

        $project = Project::create($validated);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project->load('department')
        ], 201);
    }


    public function show($id): JsonResponse{
        $allowedRoles = [
            'admin',
            'HR_manager',
            'department_manager',
            'project_manager',
            'employee',
            'intern'
        ];

        if (!in_array(Auth::user()->role, $allowedRoles)) {
        return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project = Project::with([
            'department',
            'tasks.assignee'
        ])->findOrFail($id);

        $assignedUsers = $project->tasks
            ->pluck('assignee')
            ->filter()
            ->unique('id')
            ->values();

        $interns = Intern::where('department_id', $project->department_id)->get();

        return response()->json([
            'project' => $project,
            'assigned_users' => $assignedUsers,
            'interns' => $interns
        ]);
    }


    public function update(Request $request, int $id): JsonResponse{
    
        $project = Project::findOrFail($id);
        $user = $request->user();
        $allowedRoles = ['admin', 'department_manager', 'project_manager'];

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

    
        $validated = $request->validate([
            'budget' => 'sometimes|numeric|min:0',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|in:planned,in_progress,completed,cancelled',
        ]);

    
        $project->update($validated);

    
         return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse{
   
        $project = Project::findOrFail($id);

    
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Only admin can delete projects'
            ], 403);
        }

        //check if there are associated tasks or interns
        if ($project->tasks()->count() > 0 || $project->interns()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete project: remove tasks and interns first'
            ], 400);
        }

   
        $project->delete();

    
        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }



    public function assignEmployee(Request $request, int $id): JsonResponse{
    
        $project = Project::findOrFail($id);
        $user = $request->user();

        $allowedRoles = ['admin', 'department_manager', 'project_manager'];
        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }  
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
        ]);


        $employeeId = $validated['employee_id'];

        // Role-based restrictions
        if ($user->role === 'department_manager') {
            $employee = Employee::find($employeeId);
            if ($employee->department_id !== $user->department_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only assign employees in your department'
                ], 403);
            }
        }

        if ($user->role === 'project_manager') {
            if (!$project->employees->pluck('id')->contains($employeeId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only assign employees already in your project'
                ], 403);
            }
        }

    
        $project->employees()->syncWithoutDetaching([$validated['employee_id']]);

    
        return response()->json([
            'success' => true,
            'message' => 'Employee attached to project successfully',
            'data' => $project->employees()->find($validated['employee_id'])
        ]);
    }
    public function removeEmployee(Request $request, int $id, int $employee_id): JsonResponse{
    
        $project = Project::findOrFail($id);
        $user = $request->user();
        $allowedRoles = ['admin', 'department_manager', 'project_manager'];

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

    
        if (!$project->employees()->where('employee_id', $employee_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not assigned to this project'
            ], 404);
        }


        // Role-based restrictions
        if ($user->role === 'department_manager') {
            $employee = Employee::findOrFail($employee_id);
            if ($employee->department_id !== $user->department_id) {
                return response()->json([
                'success' => false,
                'message' => 'You can only remove employees in your department'
                ], 403);
            }
        }

        if ($user->role === 'project_manager') {
            if (!$project->employees->pluck('id')->contains($employee_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only remove employees from your project'
                ], 403);
            }
        }
        $project->employees()->detach($employee_id);

    
        return response()->json([
            'success' => true,
            'message' => 'Employee removed from project successfully'
        ]);
    }

    public function assignIntern(Request $request, int $id): JsonResponse{
    
        $project = Project::findOrFail($id);
        $user = $request->user();
        $allowedRoles = ['admin', 'department_manager', 'project_manager'];
        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

  
        $validated = $request->validate([
            'intern_id' => 'required|exists:interns,id',
        ]);

        $internId = $validated['intern_id'];
        $intern = Intern::findOrFail($internId);

    
        if ($user->role === 'department_manager') {
            if ($intern->department_id !== $user->department_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only assign interns from your department'
                ], 403);
            }
        }
        if ($user->role === 'project_manager') {
            if (!$project->interns()->where('intern_id', $internId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only manage interns already assigned to your project'
                ], 403);
            }
        }
        $project->interns()->syncWithoutDetaching([$internId]);

        return response()->json([
            'success' => true,
            'message' => 'Intern assigned to project successfully',
            'data' => $intern
        ]);
    }


    public function removeIntern(Request $request, int $id, int $intern_id): JsonResponse{
        $user = Auth::user();
        $project = Project::with('interns')->findOrFail($id);


        if (in_array($user->role, ['admin', 'HR_manager'])) {
            //allowed
        }
        elseif ($user->role === 'department_manager') {
            if ($project->department_id !== $user->department_id) {
                return response()->json([
                    'message' => 'Unauthorized: Not your department'
                ], 403);
            }
        }
        elseif ($user->role === 'project_manager') {
            if ($project->manager_id !== $user->id) {
                return response()->json([
                    'message' => 'Unauthorized: Not your project'
                ], 403);
            }
        }
        else {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        if (! $project->interns()->where('intern_id', $intern_id)->exists()) {
             return response()->json([
                 'message' => 'Intern not assigned to this project'
                ], 404);
        }

   
        $project->interns()->detach($intern_id);

        return response()->json([
            'success' => true,
            'message' => 'Intern removed from project successfully'
        ]);
    }

    public function listMilestones($id): JsonResponse{
        $user = Auth::user();

        $project = Project::with('milestones')->findOrFail($id);

        if (in_array($user->role, ['admin', 'HR_manager'])) {
        }
        // Department manager → only own department
        elseif ($user->role === 'department_manager') {
            if ($project->department_id !== $user->department_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        // Project manager → only own project
        elseif ($user->role === 'project_manager') {
            if ($project->manager_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        // Employees & Interns → only if assigned
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
            'project_id' => $project->id,
            'milestones' => $project->milestones
        ]);
    }


    public function storeMilestone(Request $request, $id): JsonResponse{
        $user = Auth::user();     
        $project = Project::findOrFail($id);


        if (in_array($user->role, ['department_manager'])) {
            if ($project->department_id !== $user->department_id) {
                return response()->json([
                    'message' => 'Unauthorized: Not your department'
                ], 403);
            }
        } elseif ($user->role === 'project_manager') {
            if ($project->manager_id !== $user->id) {
                return response()->json([
                    'message' => 'Unauthorized: Not your project'
                ], 403);
            }
        }elseif (!in_array($user->role, ['admin', 'HR_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date|after_or_equal:today',
            'status' => 'required|in:pending,in_progress,completed'
        ]);

    
        $milestone = Milestone::create(array_merge($validated, [
            'project_id' => $project->id
        ]));

    
        return response()->json([
            'success' => true,
            'message' => 'Milestone created successfully',
            'data' => $milestone
        ], 201);
    }


    public function tasks($id): JsonResponse{
        $user = Auth::user();

    
        $project = Project::with('tasks.assignee')->findOrFail($id);

        if(in_array($user->role, ['admin', 'HR_manager'])) {
        } elseif ($user->role === 'department_manager') {
            if ($project->department_id !== $user->department_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }elseif ($user->role === 'project_manager') {
            if ($project->manager_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }elseif ($user->role === 'employee') {
            if (!$project->employees()->where('user_id', $user->id)->exists()) {
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
            'data' => $project->tasks
        ]);
    }

    public function storeTask(Request $request, $id): JsonResponse{
        $user = Auth::user();
        $project = Project::findOrFail($id);

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

        $validated = $request->validate([
            'assignee_id' => 'required|integer|exists:users,id', // can be employee or intern
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['pending','in_progress','completed'])],
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        
        $task = Task::create(array_merge($validated, ['project_id' => $project->id]));

        // Notify assignee
        $assignee = User::find($validated['assignee_id']);
        if ($assignee) {
                $assignee->notify(new TaskAssignedNotification($task));
        }

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task->load('assignee')
        ], 201);
    }

   public function assignProjectManager(Request $request, $projectId){
        // Only admin can assign
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate user_id
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

    // Find project and eager load projectManager
        $project = Project::findOrFail($projectId);

        // Find the user to assign as project manager
        $user = User::findOrFail($request->user_id);

        // Assign project manager
        $project->project_manager_id = $user->id;
        $project->save();

        // Change role if not already project_manager
        if ($user->role !== 'project_manager') {
            $user->update([
                'role' => 'project_manager'
            ]);
        }

        // Reload projectManager relationship to return in response
        $project->load('projectManager');

        return response()->json([
            'message' => 'Project manager assigned successfully',
            'project' => $project,
            'project_manager' => $user
        ]);
    }
         

}

    

