<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Carbon\Carbon;

class ProjectReportSummaryController extends Controller
{
    public function index()
    {
        //Load all projects with relationships
        $projects = Project::with(['tasks.logs', 'milestones'])->get();

        $totalProjects = $projects->count();

        //Projects status summary
        $statusSummary = [
            'completed' => $projects->where('status', 'completed')->count(),
            'in_progress' => $projects->where('status', 'in_progress')->count(),
            'delayed' => $projects->filter(function ($p) {
                return $p->end_date < now() && $p->status !== 'completed';
            })->count(),
        ];

        //Average task progress across all projects
        $allTasks = $projects->flatMap->tasks;

        $averageTaskProgress = $allTasks->count() > 0
            ? round($allTasks->map(function($task) {
                $latestLog = $task->logs->sortByDesc('created_at')->first();
                return $latestLog ? $latestLog->progress : 0;
            })->avg(), 2)
            : 0;

        //Total tasks and milestones
        $totalTasks = $allTasks->count();
        $totalMilestones = $projects->flatMap->milestones->count();

        //Delayed tasks
        $delayedTasks = $allTasks->filter(function ($task) {
            return $task->end_date < now() && $task->status !== 'completed';
        })->count();

        //Return response
        return response()->json([
            'success' => true,
            'total_projects' => $totalProjects,
            'projects_status_summary' => $statusSummary,
            'total_tasks' => $totalTasks,
            'total_milestones' => $totalMilestones,
            'delayed_tasks' => $delayedTasks,
            'average_task_progress' => $averageTaskProgress,
        ]);
    }

}