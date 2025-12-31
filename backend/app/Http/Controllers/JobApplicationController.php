<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    // Apply to job
    public function apply(Request $request, $jobId)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx'
        ]);

        $path = $request->file('cv')->store('job_cvs', 'public');

        return JobApplication::create([
            'user_id' => Auth::user()->id,
            'job_opening_id' => $jobId,
            'cv_path' => $path
        ]);
    }

    // Update application status (HR)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:applied,shortlisted,interviewed,accepted,rejected'
        ]);

        $application = JobApplication::findOrFail($id);
        $application->update(['status' => $request->status]);

        return response()->json(['message' => 'Status updated']);
    }
}
