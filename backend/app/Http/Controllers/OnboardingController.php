<?php

namespace App\Http\Controllers;

use App\Models\Onboarding;
use App\Models\OnboardingTask;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
     // Create onboarding when user is hired
    public function create(Request $request, $userId)
    {
        $request->validate([
            'type' => 'required|in:employee,intern'
        ]);

        $onboarding = Onboarding::create([
            'user_id' => $userId,
            'type' => $request->type,
            'start_date' => now()
        ]);

        // Default checklist
        $tasks = [
            'Submit ID copy',
            'Upload signed offer letter',
            'Upload contract',
            'Submit bank details',
            'Read company policies'
        ];

        foreach ($tasks as $title) {
            OnboardingTask::create([
                'onboarding_id' => $onboarding->id,
                'title' => $title
            ]);
        }

        return response()->json($onboarding, 201);
    }

    public function show($userId)
    {
        return Onboarding::with('tasks.documents')
            ->where('user_id', $userId)
            ->firstOrFail();
    }
}
