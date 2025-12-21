<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ProjectReportController extends Controller
{
    public function show($id){
        $user = Auth::user();

        $project = Project::with([
            'milestones',
            'tasks.logs',
            'employees.user',
            'interns.user'
        ])->findOrFail($id);

        if (!in_array($user->role, ['admin', 'HR_manager', 'department_manager', 'project_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->role === 'department_manager' && $project->department_id !== $user->department_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->role === 'project_manager' && $project->manager_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $milestones = $project->milestones->map(function ($milestone) {
            return [
                'id' => $milestone->id,
                'title' => $milestone->title,
                'due_date' => $milestone->due_date,
                'status' => $milestone->status,
                'is_delayed' => $milestone->due_date < now() && $milestone->status !== 'completed',
            ];
        });

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

        $totalTasks = $tasks->count();
        $averageProgress = $totalTasks > 0
            ? round($tasks->sum('progress') / $totalTasks, 2)
            : 0;

        $employees = $project->employees->map(function ($employee) {
            return [
                'id' => $employee->id,
                'name' => $employee->user->name,
                'position' => $employee->position,
            ];
        });

        $interns = $project->interns->map(function ($intern) {
            return [
                'id' => $intern->id,
                'name' => $intern->user->name,
                'status' => $intern->status,
            ];
        });

        $delays = [
            'delayed_tasks' => $tasks->where('is_delayed', true)->count(),
            'delayed_milestones' => $milestones->where('is_delayed', true)->count(),
            'project_deadline_passed' => $project->end_date < now() && $project->status !== 'completed',
        ];

        //Budget (placeholder for future)
        $budget = [
            'total_budget' => $project->budget,
            'used_budget' => null,
            'remaining_budget' => null
        ];

        return response()->json([
            'success' => true,
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'status' => $project->status,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
            ],
            'progress' => [
                'average_task_progress' => $averageProgress,
            ],
            'milestones' => $milestones,
            'tasks' => $tasks,
            'employees' => $employees,
            'interns' => $interns,
            'delays' => $delays,
            'budget' => $budget
        ]);
    }
}
    
