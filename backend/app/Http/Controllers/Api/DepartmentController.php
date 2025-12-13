<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;



class DepartmentController extends Controller
{
   public function index(Request $request)
   {
       $allowedRelationships = [
            'manager',
            'users',
            'interns',
            'projects',
            'internshipPositions'
        ];
        $with = $request->query('with');
        $relations = [];
        if ($with) {
            $requested = explode(',', $with);

            // Filter only valid relationships
            foreach ($requested as $rel) {
                if (in_array($rel, $allowedRelationships)) {
                    $relations[] = $rel;
                }
            }
        }
        if (!empty($relations)) {
            $departments = Department::with($relations)->get();
        } else {
            $departments = Department::all();
        }
        return response()->json([
            'success' => true,
            'count' => $departments->count(),
            'data' => $departments
        ]);     
   }
   
     public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $allowedRoles = ['admin', 'HR_manager', 'department_manager'];

    if (!in_array($user->role, $allowedRoles)) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized: You do not have permission to create a department.'
        ], 403);
    }
        // VALIDATION
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'manager_id' => 'required|exists:employees,id',
        'description' => 'nullable|string'
    ]);

    // CREATE THE DEPARTMENT
    $department = Department::create($validated);

    // RETURN RESPONSE
    return response()->json([
        'success' => true,
        'message' => 'Department created successfully',
        'data' => $department
    ], 201);
        
    }    
}
