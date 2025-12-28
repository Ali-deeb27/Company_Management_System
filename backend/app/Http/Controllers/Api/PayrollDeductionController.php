<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PayrollDeduction;
use Illuminate\Http\Request;

class PayrollDeductionController extends Controller
{
    public function store(Request $request)
    {
       
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

       
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'percentage' => 'required|numeric|min:0|max:100',
            'applies_to' => 'required|in:employee,intern,both',
        ]);

        
        $deduction = PayrollDeduction::create($validated);

        
        return response()->json([
            'success' => true,
            'message' => 'Payroll deduction created successfully',
            'data' => $deduction
        ], 201);
    }

    public function index(Request $request){
        
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'accountant'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $deductions = PayrollDeduction::all();

       
        return response()->json([
            'success' => true,
            'data' => $deductions
        ]);
    }

     public function update(Request $request, $id){
        
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $deduction = PayrollDeduction::find($id);
        if (!$deduction) {
            return response()->json([
                'success' => false,
                'message' => 'Deduction not found'
            ], 404);
        }

        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'percentage' => 'sometimes|numeric|min:0|max:100',
            'applies_to' => 'sometimes|in:employee,intern,both',
        ]);

        
        $deduction->update($validated);

        
        return response()->json([
            'success' => true,
            'message' => 'Deduction updated successfully',
            'data' => $deduction
        ]);
    }

    public function destroy(Request $request, $id)
    {
       
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

       
        $deduction = PayrollDeduction::find($id);
        if (!$deduction) {
            return response()->json([
                'success' => false,
                'message' => 'Deduction not found'
            ], 404);
        }
        $deduction->delete();

        
        return response()->json([
            'success' => true,
            'message' => 'Deduction removed successfully. Past payroll remains intact.'
        ]);
    }
}
