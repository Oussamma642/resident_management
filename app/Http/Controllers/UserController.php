<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Eager load syndic and its immeuble
        $user = User::with('syndic')->find($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $id)
    {
        try {
            $id = (int)$id;
            $authUser = Auth::user();

            // Early authorization check
            if (!$authUser || $authUser->id !== $id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Get syndic ID safely for validation
            $syndicId = $authUser->syndic?->id;

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users', 'email')->ignore($id),
                ],
                'password' => ['nullable', 'string', 'min:8'],
                'phone' => [
                    'required',
                    'string',
                    $syndicId ? Rule::unique('syndics', 'phone')->ignore($syndicId) : 'string',
                ],
            ]);

            return DB::transaction(function () use ($validated, $authUser) {
                /** @var \App\Models\User $user */
                $user = $authUser;

                // Prepare update data
                $updateData = [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                ];

                // Only include password if provided
                if (!empty($validated['password'])) {
                    $updateData['password'] = Hash::make($validated['password']);
                }

                $user->update($updateData);

                // Update syndic phone if relationship exists
                if ($user->syndic) {
                    $user->syndic->update(['phone' => $validated['phone']]);
                }

                return response()->json([
                    'message' => 'Utilisateur mis à jour avec succès.',
                    'user' => $user->fresh()
                ], 200);
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('User update failed', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Une erreur serveur est survenue'], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès.'], 200);
    }
}
