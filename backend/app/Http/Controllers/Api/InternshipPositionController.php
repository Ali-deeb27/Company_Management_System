<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InternshipPosition;
use Illuminate\Http\Response;

class InternshipPositionController extends Controller
{
    public function index(Request $request)
    {
        $query = InternshipPosition::query();

        if ($request->has('department_id')) {
            $query->where('department_id', $request->get('department_id'));
        }
        if ($request->has('project_id')) {
            $query->where('project_id', $request->get('project_id'));
        }

        return response()->json($query->with(['department','project'])->paginate(20));
    }

    public function show($id)
    {
        $position = InternshipPosition::with(['department','project'])->findOrFail($id);
        return response()->json($position);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'nullable|integer|exists:departments,id',
            'project_id' => 'nullable|integer|exists:projects,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $position = InternshipPosition::create($data);

        return response()->json($position, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $position = InternshipPosition::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'nullable|integer|exists:departments,id',
            'project_id' => 'nullable|integer|exists:projects,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $position->update($data);

        return response()->json($position);
    }

    public function destroy($id)
    {
        $position = InternshipPosition::findOrFail($id);
        $position->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
