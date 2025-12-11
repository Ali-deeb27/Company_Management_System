<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Intern;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email',
            'password' => 'required|min:8',
            'phone'    => 'required|string|max:20',
            'address'  => 'required|string|max:255',
        ]);

        // If a user with this email already exists, tell them to log in
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'User already exists. Please log in.'
            ], 409);
        }

        // Check if registering user is and admin based on his predefined credentials
        $adminEmail = config('app.admin_email', env('ADMIN_EMAIL', 'admin@company.com'));
        $adminPassword = config('app.admin_password', env('ADMIN_PASSWORD', 'admin123456')); 
        $isAdmin = $request->email === $adminEmail && $request->password === $adminPassword;
        $role = $isAdmin ? 'admin' : 'intern';

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone, 
            'address'  => $request->address,
            'role'     => $role,
        ]);

        // if the user is an intern, insert a record in the interns table
        if ($role === 'intern') {
            Intern::create([
                'user_id' => $user->id,
            ]);
        }

        $token = $user->createToken('authenticate_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token,
            'role' => $role,
        ]);
    }

}
