<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalaryComponent;
use App\Models\Employee;

class SalaryComponentController extends Controller
{
    public function store(Request $request){
        
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'accountant'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

      
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|in:base,allowance,bonus,deduction',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'is_taxable' => 'sometimes|boolean',
            'is_recurring' => 'sometimes|boolean',
        ]);

       
        $component = SalaryComponent::create([
            'employee_id' => $validated['employee_id'],
            'type' => $validated['type'],
            'name' => $validated['name'],
            'amount' => $validated['amount'],
            'is_taxable' => $validated['is_taxable'] ?? true,
            'is_recurring' => $validated['is_recurring'] ?? true,
        ]);

       
        return response()->json([
            'success' => true,
            'message' => 'Salary component created successfully',
            'data' => $component
        ], 201);
    }

    public function indexByEmployee(Request $request, $employee_id){
        
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'accountant'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

       
        $employee = Employee::find($employee_id);
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

       
        $components = SalaryComponent::where('employee_id', $employee_id)->get();

        return response()->json([
            'success' => true,
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->user->name ?? 'N/A',
            ],
            'components' => $components
        ]);
    }

    public function update(Request $request, $id)
    {
        
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'accountant'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $component = SalaryComponent::find($id);
        if (!$component) {
            return response()->json([
                'success' => false,
                'message' => 'Salary component not found'
            ], 404);
        }

        
        $validated = $request->validate([
            'type' => 'sometimes|in:base,allowance,bonus,deduction',
            'name' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0',
            'is_taxable' => 'sometimes|boolean',
            'is_recurring' => 'sometimes|boolean',
        ]);

       
        $component->update($validated);

        
        return response()->json([
            'success' => true,
            'message' => 'Salary component updated successfully',
            'data' => $component
        ]);
    }

     public function destroy(Request $request, $id){
        
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'accountant'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $component = SalaryComponent::find($id);
        if (!$component) {
            return response()->json([
                'success' => false,
                'message' => 'Salary component not found'
            ], 404);
        }

        

        
        $component->delete();

       
        return response()->json([
            'success' => true,
            'message' => 'Salary component deleted successfully'
        ]);
    }
}

