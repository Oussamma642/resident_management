<?php

namespace App\Http\Controllers;

use App\Models\Proprietaire;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

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
        $proprietaire = DB::selectOne(
            '
                select u.*, p.* from users u
                inner join proprietaires p on p.user_id = u.id
                where u.id = ?
            ',
            [$id]
        );
        return response()->json($proprietaire);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $id)
    {
        // Authorize the action (adjust policy as needed)
        // $this->authorize('update', Proprietaire::class);

        try {
            $validated = $request->validate([
                'id'                 => ['required', 'exists:proprietaires,id'],
                'user_id'            => ['required', 'exists:users,id'],
                'immeuble_id'        => ['required', 'exists:immeubles,id'],
                'name'               => ['required', 'string', 'max:255'],
                'email'              => [
                    'required',
                    'email',
                    Rule::unique('users', 'email')->ignore($request->input('user_id')),
                ],
                // Make password optional for update; require min length if present
                'password'           => ['nullable', 'string', 'min:8'],
                'phone'              => [
                    'required',
                    'string',
                    Rule::unique('proprietaires', 'phone')->ignore($request->input('id')),
                ],
                'etage'              => ['required', 'integer', 'min:-10'],
                'numero_appartement' => ['required', 'integer'],
            ]);

            return DB::transaction(function () use ($validated) {

                // Ensure apartment uniqueness in the same building and floor excluding current proprietaire

                $already = Proprietaire::where('immeuble_id', $validated['immeuble_id'])
                    ->where('etage', $validated['etage'])
                    ->where('numero_appartement', $validated['numero_appartement'])
                    ->where('id', '!=', $validated['id'])
                    ->exists();

                if ($already) {
                    return response()->json([
                        'message' => 'Données invalides',
                        'errors' => [
                            'numero_appartement' => ["Cet appartement est déjà occupé à l'étage: " . $validated['etage']]
                        ]
                    ], 422);
                }

                $user = User::findOrFail($validated['user_id']);
                $user->name = $validated['name'];
                $user->email = $validated['email'];
                if (!empty($validated['password'])) {
                    $user->password = Hash::make($validated['password']);
                }
                $user->save();

                $proprietaire = Proprietaire::findOrFail($validated['id']);
                $proprietaire->phone = $validated['phone'];
                $proprietaire->etage = (int) $validated['etage'];
                $proprietaire->numero_appartement = (int) $validated['numero_appartement'];
                $proprietaire->immeuble_id = $validated['immeuble_id'];
                $proprietaire->save();

                // Prefer returning 200 for successful update
                return response()->json([
                    'message' => 'Propriétaire mis à jour avec succès',
                    'proprietaire' => $proprietaire->load('user')
                    // Or use new ProprietaireResource($proprietaire->load('user'))
                ], 200);
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log real exception, but return a generic error to the client
            Log::error('Proprietaire update failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Une erreur serveur est survenue'], 500);
        }
    }


    /*
    public function update(Request $request, string $id)
    {

        try {
            $validated = $request->validate([
                'id'                 => 'required|exists:proprietaires,id',
                'user_id'            => 'required|exists:users,id',
                'immeuble_id'        => 'required|exists:immeubles,id',
                'name'               => 'required|string|max:255',
                'email'              => ['required', 'email', Rule::unique('users', 'email')->ignore($request->input('user_id'))],
                'password'           => 'required|string|min:8',
                'phone'              => ['required', 'string', Rule::unique('proprietaires', 'phone')->ignore($request->input('id'))],
                'etage'              => 'required|integer|min:0',
                'numero_appartement' => 'required|integer',
            ]);

            return DB::transaction(function () use ($validated) {

                // Check apartment uniqueness using Eloquent (cleaner)
                $apartmentExists = Proprietaire::where('immeuble_id', $validated['immeuble_id'])
                    ->where('etage', $validated['etage'])
                    ->where('numero_appartement', $validated['numero_appartement'])
                    // add another condition to exclude current proprietaire
                    ->where('id', '!=', $validated['id'])
                    ->exists();

                if ($apartmentExists) {
                    return response()->json([
                        'message' => 'Données invalides',
                        'errors' => [
                            'numero_appartement' => ["Cet appartement est déjà occupé à l'étage: " . $validated['etage']]
                        ]
                    ], 422);
                }

                $user = User::findOrFail($validated['user_id']);
                $user->name     = $validated['name'];
                $user->email    = $validated['email'];
                $user->password = bcrypt($validated['password']);
                $user->save();


                $proprietaire = Proprietaire::findOrFail($validated['id']);
                $proprietaire->phone              = $validated['phone'];
                $proprietaire->etage              = $validated['etage'];
                $proprietaire->numero_appartement = $validated['numero_appartement'];
                $proprietaire->immeuble_id        = $validated['immeuble_id'];
                $proprietaire->save();

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

    */

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        $user = User::findOrFail($proprietaire->user_id);
        $proprietaire->delete();
        $user->delete(); // This will also delete the proprietaire due to foreign key constraint
        return response()->json(null, 204);
    }
}
