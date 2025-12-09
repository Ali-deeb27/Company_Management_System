<?php

namespace App\Http\Controllers;

use App\Models\Intern;
use Illuminate\Http\Request;

class InternController extends Controller
{
     public function assignMentor(Request $request, $intern_id)
    {
        $request->validate([
            'mentor_id' => 'required|exists:employees,id',
        ]);

        $intern = Intern::findOrFail($intern_id);
        $intern->mentor_id = $request->mentor_id;
        $intern->save();

        return response()->json([
            'message' => 'Mentor assigned successfully',
            'intern' => $intern
        ]);
    }
}
