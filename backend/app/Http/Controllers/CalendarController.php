<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    public function index()
    {
        $employee = Auth::user()->employee;

        // Events
        $events = Event::all()->map(function ($event) {
            return [
                'title' => $event->title,
                'start' => $event->date,
                'type'  => 'event'
            ];
        });

        // Announcements
        $announcements = Announcement::where('target_type', 'all')
            ->orWhere('target_type', 'department')
            ->orWhere('target_type', 'team')
            ->get()
            ->map(function ($announcement) {
                return [
                    'title' => $announcement->title,
                    'start' => $announcement->created_at->toDateString(),
                    'type'  => 'announcement'
                ];
            });

        return response()->json(
            $events->merge($announcements)
        );
    }
}
