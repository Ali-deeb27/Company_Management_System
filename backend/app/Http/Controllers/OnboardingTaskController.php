<?php

namespace App\Http\Controllers;

use App\Models\OnboardingDocument;
use App\Models\OnboardingTask;
use Illuminate\Http\Request;

class OnboardingTaskController extends Controller
{
    // User submits task + document
    public function submit(Request $request, $taskId)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png'
        ]);

        $task = OnboardingTask::findOrFail($taskId);

        $path = $request->file('document')
                        ->store('onboarding_documents', 'public');

        OnboardingDocument::create([
            'onboarding_task_id' => $task->id,
            'file_path' => $path
        ]);

        $task->update(['status' => 'submitted']);
        return response()->json(['message' => 'Task submitted']);
    }

    // HR approves task
    public function approve($taskId)
    {
        $task = OnboardingTask::findOrFail($taskId);
        $task->update(['status' => 'approved']);

        return response()->json(['message' => 'Task approved']);
    }
}
