<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // List all events
    public function index()
    {
        return response()->json(
            Event::orderBy('date', 'asc')->get()
        );
    }

    // Create event (training / seminar / social)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'target_audience' => 'required|string'
        ]);

        $event = Event::create($request->all());

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event
        ], 201);
    }

    // Show single event
    public function show($id)
    {
        return response()->json(
            Event::findOrFail($id)
        );
    }

    // Update event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $event->update($request->all());

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }

    // Delete event
    public function destroy($id)
    {
        Event::destroy($id);

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}
