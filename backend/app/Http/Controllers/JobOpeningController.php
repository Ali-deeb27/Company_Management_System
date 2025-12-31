<?php

namespace App\Http\Controllers;

use App\Models\JobOpening;
use Illuminate\Http\Request;

class JobOpeningController extends Controller
{
     // List all jobs
    public function index()
    {
        return JobOpening::where('status', 'open')
            ->latest()
            ->get();
    }

    // Create job (HR only)
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'location' => 'nullable|string',
            'deadline' => 'nullable|date'
        ]);

        return JobOpening::create($data);
    }

    // View job + applicants
    public function show($id)
    {
        return JobOpening::with([
            'department',
            'applications.user'
            ])->findOrFail($id);
    }

    // Close job
    public function close($id)
    {
        $job = JobOpening::findOrFail($id);
        $job->update(['status' => 'closed']);

        return response()->json(['message' => 'Job closed']);
    }
}
