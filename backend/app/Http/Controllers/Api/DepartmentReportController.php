<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DepartmentReportController extends Controller
{
    public function show($id){
        $user = Auth::user();

        $department = Department::with([
            'projects.tasks.logs',
            'projects.milestones',
            'projects.employees.user',
            'projects.interns.user',
            'employees.user'
        ])->findOrFail($id);

        if (!in_array($user->role, ['admin', 'HR_manager', 'department_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->role === 'department_manager' && $department->id !== $user->department_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $projects = $department->projects->map(function ($project) {
            $tasks = $project->tasks->map(function ($task) {
                $latestLog = $task->logs->sortByDesc('created_at')->first();

                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'progress' => $latestLog ? $latestLog->progress : 0,
                    'start_date' => $task->start_date,
                    'end_date' => $task->end_date,
                    'is_delayed' => $task->end_date < now() && $task->status !== 'completed',
                ];
            });

            $milestones = $project->milestones->map(function ($milestone) {
                return [
                    'id' => $milestone->id,
                    'title' => $milestone->title,
                    'status' => $milestone->status,
                    'is_delayed' => $milestone->due_date < now() && $milestone->status !== 'completed',
                ];
            });

            $totalTasks = $tasks->count();
            $averageProgress = $totalTasks > 0
                ? round($tasks->sum('progress') / $totalTasks, 2)
                : 0;

            return [
                'id' => $project->id,
                'name' => $project->name,
                'status' => $project->status,
                'tasks' => $tasks,
                'milestones' => $milestones,
                'average_task_progress' => $averageProgress,
            ];
        });

        //Employees workload & performance
        $employees = $department->employees->map(function ($employee) use ($department) {
            // Count tasks assigned in department projects
            $assignedTasks = $department->projects->flatMap->tasks
                ->filter(fn($task) => $task->assignee_id === $employee->user_id);

            $totalTasks = $assignedTasks->count();
            $completedTasks = $assignedTasks->filter(fn($task) => $task->status === 'completed')->count();

            return [
                'id' => $employee->id,
                'name' => $employee->user->name,
                'position' => $employee->position,
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'completion_rate' => $totalTasks > 0 ? round(($completedTasks/$totalTasks)*100,2) : 0,
            ];
        });

        // 5️⃣ Return response
        return response()->json([
            'success' => true,
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
            ],
            'projects' => $projects,
            'employees' => $employees,
        ]);
    }


}