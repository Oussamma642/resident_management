<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Proprietaire;
use App\Models\Syndic;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $credentials = $request->validated();

            // Hash the password
            $credentials['password'] = Hash::make($credentials['password']);

            // Start database transaction
            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $credentials['name'],
                'email' => $credentials['email'],
                'password' => $credentials['password'],
                'role' => $credentials['role'] ?? 'syndic',
            ]);

            // Create syndic record
            Syndic::create([
                'phone' => $credentials['phone'],
                'user_id' => $user->id
            ]);

            // Commit transaction
            DB::commit();

            // Generate API token
            $token = $user->createToken('main')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollback();

            // Log the error for debugging
            Log::error('Registration failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Registration failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            // Find the user with the given email
            $user = User::where('email', $credentials['email'])->first();

            // Check if user exists, password matches, and role is syndic
            if (!$user || !Hash::check($credentials['password'], $user->password) || $user->role !== 'syndic') {
                return response()->json([
                    'message' => 'Provided email, password, or role is incorrect',
                ], 401);
            }

            // Generate API token
            $token = $user->createToken('main')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Login failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            $user->currentAccessToken()->delete();

            return response('', 204);

        } catch (\Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Logout failed. Please try again.',
            ], 500);
        }
    }
}
