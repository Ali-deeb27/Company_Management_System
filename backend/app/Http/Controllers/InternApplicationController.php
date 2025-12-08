<?php

namespace App\Http\Controllers;

use App\Models\InternApplication;
use App\Models\Intern;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;


class InternApplicationController extends Controller
{
    public function index()   //only admin and hr
    {
        $applications = InternApplication::with(['user', 'department', 'approvedBy'])->latest()->get();
        return response()->json($applications);
    }

    public function userApplications()
    {
        $applications = InternApplication::where('user_id', Auth::id())->with(['department'])->latest()->get();
        return response()->json($applications);
    }

     public function store(Request $request)
    {
        $request->validate([
            'cover_letter'  => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'cv'            => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $exists = InternApplication::where('user_id', Auth::id())->where('status', 'pending')->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Application is already pending.'
            ], 409);
        }

        $data = $request->only(['cover_letter', 'department_id']);
        $data['user_id'] = Auth::id();

        if ($request->hasFile('cv')) {
            $data['cv'] = $request->file('cv')->store('', 'public');
        }

        $application = InternApplication::create($data);

        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application
        ], 201);
    }

    public function show($id)
    {
        $application = InternApplication::with(['user', 'department', 'approvedBy'])->findOrFail($id);
        return response()->json($application);
    }


    public function approve($id)
    {
        $application = InternApplication::findOrFail($id);

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'This application has already been processed.'], 409);
        }

        $application->update([
            'status'       => 'approved',
            'approved_by'  => Auth::id(),
        ]);

        Intern::create([
            'user_id'       => $application->user_id,
            'department_id' => $application->department_id,
            'mentor_id'     => $application->mentor_id,     
            'start_date'    => now(),
            'end_date'      => null,
            'status'        => 'active',
        ]);

        return response()->json([
            'message' => 'Application approved and intern profile created.',
            'application' => $application
        ]);
    }

    
    public function reject($id)
    {
        $application = InternApplication::findOrFail($id);

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'This application has already been processed.'], 409);
        }

        $application->update([
            'status'      => 'rejected',
            'approved_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Application rejected.',
            'application' => $application
        ]);
    }

    public function destroy($id)
    {
        $application = InternApplication::findOrFail($id);

        if ($application->user_id !== Auth::id() &&  !Auth::isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($application->cv) {
            Storage::disk('public')->delete($application->cv);
        }

        $application->delete();

        return response()->json(['message' => 'Application deleted.']);
    }
}
