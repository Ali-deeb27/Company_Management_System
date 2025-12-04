<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid data!'
            ], 401);
        }

        $token = $user->createToken('authenticate_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'name'   => $user->name,
            'email'  => $user->email,
            'token' => $token,
            'role' => $user->role
        ]);
    }
}

