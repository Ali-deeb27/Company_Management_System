<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function overview(Request $request){
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'department_manager', 'project_manager'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $query = DB::table('projects')
        ->select(
       DB::raw('COUNT(*) as total_projects'),
                DB::raw('SUM(CASE WHEN status="active" THEN 1 ELSE 0 END) as active_projects'),
                DB::raw('SUM(CASE WHEN status="completed" THEN 1 ELSE 0 END) as completed_projects'),
                DB::raw('SUM(CASE WHEN status="delayed" THEN 1 ELSE 0 END) as delayed_projects')
            );

        if ($user->role === 'department_manager') {
            $query->where('department_id', $user->department_id);
        }

        $report = $query->first();

        return response()->json([
            'total_projects' => $report?->total_projects ?? 0,
            'active_projects' => $report?->active_projects ?? 0,
            'completed_projects' => $report?->completed_projects ?? 0,
            'delayed_projects' => $report?->delayed_projects ?? 0
        ]);
    }

    public function byDepartment(Request $request)
    {
        $user = $request->user();

        
        if (!in_array($user->role, ['admin', 'department_manager'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        
        $query = DB::table('projects')
            ->join('departments', 'projects.department_id', '=', 'departments.id')
            ->select(
                'departments.id as department_id',
                'departments.name as department_name',
                DB::raw('COUNT(projects.id) as total_projects'),
                DB::raw('SUM(CASE WHEN projects.status="active" THEN 1 ELSE 0 END) as active_projects'),
                DB::raw('SUM(CASE WHEN projects.status="completed" THEN 1 ELSE 0 END) as completed_projects'),
                DB::raw('SUM(CASE WHEN projects.status="delayed" THEN 1 ELSE 0 END) as delayed_projects')
            )
            ->groupBy('departments.id', 'departments.name');

        
        if ($user->role === 'department_manager') {
            $query->where('projects.department_id', $user->department_id);
        }

        
        $report = $query->get();

        return response()->json([
            'report' => $report
        ]);
    }

    public function taskProgress(Request $request, $project_id)
    {
        $user = $request->user();

        
        $project = Project::find($project_id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

       
        if ($user->role === 'project_manager') {
            // Assuming project has project_manager_id
            if ($project->project_manager_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized for this project'], 403);
            }
        } elseif ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        //Task statistics
        $taskStats = DB::table('tasks')
            ->where('project_id', $project_id)
            ->select(
                DB::raw('COUNT(*) as total_tasks'),
                DB::raw('SUM(CASE WHEN status="completed" THEN 1 ELSE 0 END) as completed_tasks'),
                DB::raw('SUM(CASE WHEN status="in_progress" THEN 1 ELSE 0 END) as in_progress_tasks'),
                DB::raw('SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) as pending_tasks')
            )
            ->first();

        //Completion percentage
        $completionRate = ($taskStats->total_tasks > 0)
            ? round(($taskStats->completed_tasks / $taskStats->total_tasks) * 100, 2)
            : 0;

        
        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'status' => $project->status
            ],
            'tasks' => [
                'total' => $taskStats->total_tasks,
                'completed' => $taskStats->completed_tasks,
                'in_progress' => $taskStats->in_progress_tasks,
                'pending' => $taskStats->pending_tasks,
                'completion_rate' => $completionRate . '%'
            ]
        ]);
    }
}
    
