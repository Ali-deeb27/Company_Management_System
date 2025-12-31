<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
     public function store(Request $request, $interviewId)
    {
        $data = $request->validate([
            'score' => 'nullable|integer|min:1|max:10',
            'comments' => 'nullable|string',
            'recommended' => 'required|boolean'
        ]);

        return Evaluation::create([
            'interview_id' => $interviewId,
            'score' => $data['score'] ?? null,
            'comments' => $data['comments'] ?? null,
            'recommended' => $data['recommended']
        ]);
    }
}
