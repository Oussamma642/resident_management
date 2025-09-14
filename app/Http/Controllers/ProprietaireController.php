<?php

namespace App\Http\Controllers;

use App\Models\Proprietaire;
use App\Models\User;
use App\Rules\UniqueApartmentInBuilding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProprietaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // User ID => Syndic ID => Immeuble ID => Propriétaires
        $usr      = auth()->user();
        $immeuble = $usr->syndic->immeuble;
        if (! $immeuble) {
            return response()->json(['message' => 'Immeuble not found'], 404);
        }

        $proprietaires = DB::select(
            '
                select u.*, p.* from users u
                inner join proprietaires p on p.user_id = u.id
                where p.immeuble_id = ?
            ',
            [$immeuble->id]
        );


        // Fetch all proprietaires for the authenticated user's immeuble
        // $proprietaires = $immeuble->proprietaires;
        return response()->json($proprietaires);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'               => 'required|string|max:255',
                'email'              => 'required|email|unique:users,email',
                'password'           => 'required|string|min:8',
                'phone'              => 'required|string|unique:proprietaires,phone',
                'etage'              => 'required|integer|min:0',
                'numero_appartement' => 'required|integer',
            ]);

            return DB::transaction(function () use ($validated) {

                $authUser = auth()->user();
                if (!$authUser->syndic || !$authUser->syndic->immeuble) {
                    throw new \Exception('Immeuble not found');
                }
                $immeuble = $authUser->syndic->immeuble;

                // Check apartment uniqueness using Eloquent (cleaner)
                $apartmentExists = Proprietaire::where('immeuble_id', $immeuble->id)
                    ->where('etage', $validated['etage'])
                    ->where('numero_appartement', $validated['numero_appartement'])
                    ->exists();

                if ($apartmentExists) {
                    return response()->json([
                        'message' => 'Données invalides',
                        'errors' => [
                            'numero_appartement' => ["Cet appartement est déjà occupé à l'étage: " . $validated['etage']]
                        ]
                    ], 422);
                }

                $user = User::create([
                    'name'     => $validated['name'],
                    'email'    => $validated['email'],
                    'password' => bcrypt($validated['password']),
                    'role'     => 'proprietaire',
                ]);

                $proprietaire = Proprietaire::create([
                    'user_id'            => $user->id,
                    'phone'              => $validated['phone'],
                    'etage'              => $validated['etage'],
                    'numero_appartement' => $validated['numero_appartement'],
                    'immeuble_id'        => $immeuble->id,
                ]);

                return response()->json([
                    'message' => 'Propriétaire créé avec succès',
                    'proprietaire' => $proprietaire->load('user')
                ], 201);
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

// tester b syndic akher

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        return response()->json($proprietaire);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);

        $validated = $request->validate([
            'phone'              => 'sometimes|required|string|unique:proprietaires,phone,' . $id,
            'etage'              => 'sometimes|required|integer',
            'numero_appartement' => 'sometimes|required|integer',
        ]);

        $proprietaire->update($validated);
        return response()->json($proprietaire);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        $proprietaire->delete();
        return response()->json(null, 204);
    }
}
