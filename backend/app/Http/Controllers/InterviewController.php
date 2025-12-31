<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
     public function schedule(Request $request, $applicationId)
    {
        $data = $request->validate([
            'scheduled_at' => 'required|date',
            'location' => 'nullable|string',
            'interviewer_id' => 'required|exists:employees,id'
        ]);

        return Interview::create([
            'job_application_id' => $applicationId,
            'scheduled_at' => $data['scheduled_at'],
            'location' => $data['location'] ?? null,
            'interviewer_id' => $data['interviewer_id'],
        ]);
    }

    public function complete($id)
    {
        $interview = Interview::findOrFail($id);
        $interview->update(['status' => 'completed']);

        return response()->json(['message' => 'Interview completed']);
    }
}
