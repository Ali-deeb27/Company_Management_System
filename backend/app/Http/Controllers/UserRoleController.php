<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserRoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    
    // Change a user's role (admin only) 
    public function changeRole(Request $request, $userId)
    {
        $user = Auth::user();
        
        // Check if the authenticated user is an admin
        if (!(Auth::user()->role=='admin')) {
            return response()->json(['message' => 'Unauthorized. Only admins can change user roles.'], 403);
        }

        $request->validate([
            'role' => [
                'required',
                'string',
                Rule::in([
                    'admin',
                    'employee',
                    'intern',
                    'HR_manager',
                    'department_manager',
                    'project_manager',
                    'accountant',
                ])
            ],
        ]);

        $user = User::findOrFail($userId);
        $oldRole = $user->role;
        $newRole = $request->role;

        // Prevent changing admin to another role 
        if ($oldRole === 'admin' && $oldRole !== $newRole && $user->id !==  Auth::id()) {
            return response()->json(['message' => 'Cannot change admin role.'], 403);
        }

        $user->update(['role' => $newRole]);

        return response()->json([
            'message' => "User role changed from {$oldRole} to {$newRole}",
            'user' => $user,
        ]);
    }

    
    // Get all users with their roles (for admin only)
    public function getAllUsers(Request $request)
    {
        // Check if the user is an admin
        if (!(Auth::user()->role == 'admin')) {
            return response()->json(['message' => 'Unauthorized. Only admins can view all users.'], 403);
        }

        $users = User::select('id', 'name', 'email', 'phone', 'role', 'status', 'created_at')->get();
        return response()->json($users);
    }

    // Get a specific user's details (for admin only)
     
    public function getUser($userId)
    {
        // Check if the user is an admin
        if (!(Auth::user()->role == 'admin')) {
            return response()->json(['message' => 'Unauthorized! Only admins can view user details.'], 403);
        }
        $user = User::findOrFail($userId);
        return response()->json($user);
    }
}
