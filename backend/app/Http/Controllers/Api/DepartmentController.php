<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;



class DepartmentController extends Controller
{
   public function index(Request $request){
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
   
     public function store(Request $request): JsonResponse{
        $user = $request->user();
        $allowedRoles = ['admin'];

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
    public function show(int $id){

        $user = request()->user();

    // Admin & HR Manager → full access
        if (!in_array($user->role, ['admin', 'HR_Manager'])) {

        // Department Manager → only his department
            if ($user->role === 'department_manager') {
                if ($user->department_id !== $id) {
                     return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized'
                    ], 403);
                }
            } 
        // Others → denied
        else {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
    }
        $department = Department::with([
           'users',     // to get employees in the department
           'projects'   // to get department projects
    ])->find($id);

    if (!$department) {
        return response()->json([
            'success' => false,
            'message' => 'Department not found'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $department
    ]);
    }

    public function update(Request $request, int $id){
    $user = $request->user();

    $department = Department::find($id);
    if (!$department) {
        return response()->json([
            'success' => false,
            'message' => 'Department not found'
        ], 404);
    }

    // Authorization
    if (!in_array($user->role, ['admin', 'HR_Manager'])) {
        if ($user->role === 'department_manager' && $user->department_id !== $department->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role !== 'department_manager') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }

    // Validation
    // We use sometimes to allow updates for only the entered fields
    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'manager_id' => 'sometimes|nullable|exists:employees,id',
        'description' => 'sometimes|nullable|string',
    ]);

    $department->update($validated);

    return response()->json([
        'success' => true,
        'data' => $department
    ]);
    }
    public function destroy(int $id): JsonResponse{
    $user = request()->user();

    // Authorization
    if (!in_array($user->role, ['admin'])) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    // Find department
    $department = Department::find($id);

    if (!$department) {
        return response()->json([
            'success' => false,
            'message' => 'Department not found'
        ], 404);
    }

    //  deleting department
    $department->delete();

    return response()->json([
        'success' => true,
        'message' => 'Department permanently deleted'
    ]);
    }

    
    //maybe modified
public function assignEmployee(Request $request, int $id): JsonResponse{
    $authUser = $request->user();

    // Authorization
    if (!in_array($authUser->role, ['admin', 'HR_Manager'])) {

        if ($authUser->role === 'department_manager') {
            if ($authUser->department_id !== $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
    }

    // Validate input
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
    ]);

    // Find department
    $department = Department::find($id);
    if (!$department) {
        return response()->json([
            'success' => false,
            'message' => 'Department not found'
        ], 404);
    }

    // Find user (employee)
    $user = User::find($validated['user_id']);

    // ensure user is an employee
    if ($user->role !== 'employee') {
        return response()->json([
            'success' => false,
            'message' => 'Only employees can be assigned to departments'
        ], 422);
    }

    // Assign employee to department
    $user->department_id = $department->id;
    $user->save();

    if ($user->employee) { 
    $user->employee->department_id = $department->id;
    $user->employee->save();
    }

    // Response
    return response()->json([
        'success' => true,
        'message' => 'Employee assigned to department successfully',
        'data' => [
            'user_id' => $user->id,
            'department_id' => $department->id
        ]
    ]);
    }

    //remove employee from department
    public function removeEmployee($id, $employee_id): JsonResponse{
    $authUser = Auth::user();

    $allowedRoles = ['admin', 'HR_manager', 'department_manager'];

    if (!in_array($authUser->role, $allowedRoles)) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    if (
        $authUser->role === 'department_manager' &&
        $authUser->department_id != $id
    ) {
        return response()->json([
            'message' => 'You can only manage your own department'
        ], 403);
    }

    $department = Department::findOrFail($id);

    $employee = User::where('id', $employee_id)
        ->where('role', 'employee')
        ->first();

    if (!$employee) {
        return response()->json(['message' => 'Employee not found'], 404);
    }

    //department manager cannot remove himself
    if (
        $authUser->role === 'department_manager' &&
        $authUser->id === $employee->id
    ) {
        return response()->json([
            'message' => 'Department manager cannot remove himself from the department'
        ], 403);
    }

    if ($employee->department_id != $department->id) {
        return response()->json([
            'message' => 'Employee does not belong to this department'
        ], 422);
    }

    $employee->department_id = null;
    $employee->save();

    return response()->json([
        'message' => 'Employee removed from department successfully',
        'employee' => $employee->fresh()
    ]);
    }
}