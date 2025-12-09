<?php

namespace App\Http\Controllers;

use App\Models\Intern;
use App\Models\InternEvaluation;
use App\Models\InternProgress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class InternTrackingController extends Controller
{
    public function addProgress(Request $request, $intern_id)
    {

    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'progress_date' => 'required|date',
    ]);

    $employee = Auth::user()->employee;
    if (!$employee) {
            return response()->json(['message' => 'Only employees can create progress'], 403);
    }
    $progress = InternProgress::create([
        'intern_id' => $intern_id,
        'created_by' => $employee->id,
        'title' => $request->title,
        'description' => $request->description,
        'progress_date' => $request->progress_date,
    ]);

    return response()->json(['message' => 'Progress added!', 'data' => $progress]);
}

public function addEvaluation(Request $request, $intern_id)
{
    $request->validate([
        'rating' => 'required|integer|min:1|max:10',
        'comments' => 'nullable|string',
        'evaluation_date' => 'required|date',
    ]);

    $employee = Auth::user()->employee;
     if (!$employee) {
        return response()->json(['message' => 'Only employees can add evaluation'], 403);
    }
    $evaluation = InternEvaluation::create([
        'intern_id' => $intern_id,
        'mentor_id' => $employee->id,
        'rating' => $request->rating,
        'comments' => $request->comments,
        'evaluation_date' => $request->evaluation_date,
    ]);

    return response()->json(['message' => 'Evaluation submitted.', 'data' => $evaluation]);
}

public function showTracking($intern_id)
{
    $intern = Intern::with(['progress', 'evaluations'])->findOrFail($intern_id);

    return response()->json([
        'intern' => $intern,
        'progress' => $intern->progress,
        'evaluations' => $intern->evaluations
    ]);
}
}
