<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    // List all announcements (Admin / HR)
    public function index()
    {
        return response()->json(
            Announcement::latest()->get()
        );
    }

    // Create a new announcement
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_type' => 'required|in:all,department,team',
        ]);

        $announcement = Announcement::create($request->only('title','message','target_type'));

        return response()->json([
            'message' => 'Announcement created successfully',
            'announcement' => $announcement
        ], 201);
    }

    // Show a single announcement
    public function show($id)
    {
        $announcement = Announcement::findOrFail($id);
        return response()->json($announcement);
    }

    // Update an announcement
    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'target_type' => 'sometimes|in:all,department,team',
        ]);

        $announcement->update($request->only('title','message','target_type'));

        return response()->json([
            'message' => 'Announcement updated successfully',
            'announcement' => $announcement
        ]);
    }

    // Delete an announcement
    public function destroy($id)
    {
        Announcement::destroy($id);

        return response()->json([
            'message' => 'Announcement deleted successfully'
        ]);
    }

    // List announcements for a logged-in employee
    public function myAnnouncements(Request $request)
    {
        $employee = Auth::user()->employee;

        // Employees get announcements:
        //  - all staff
        //  - their department
        //  - their team
        $announcements = Announcement::where('target_type', 'all')
            ->orWhere(function ($q) use ($employee) {
                $q->where('target_type', 'department');
            })
            ->orWhere(function ($q) use ($employee) {
                $q->where('target_type', 'team');
            })
            ->latest()
            ->get();

        return response()->json($announcements);
    }
}
