<?php

namespace App\Http\Controllers;

use App\Models\Immeuble;
use App\Models\Syndic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImmeubleController extends Controller
{
    /**
     * Affiche la liste des immeubles du syndic connecté.
     */


    public function index()
    {
        $user = Auth::user();
        $syndicId = $user->syndic->id;

        $immeuble = Immeuble::where('syndic_id', $syndicId)->first();

        if ($immeuble) {
            return response()->json([$immeuble]);
        } else {
            return response()->json([]);
        }
    }

    public function getImmeubleOfAuthSyndic()
    {
        $user = Auth::user();
        $syndicId = $user->syndic->id;

        $immeuble = Immeuble::where('syndic_id', $syndicId)->get();

        if ($immeuble) {
            return response()->json($immeuble);
        } else {
            return response()->json(['message' => 'Immeuble non trouvé'], 404);
        }
    }

    /**
     * Enregistre un nouvel immeuble.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
        ]);

        $user = Auth::user();
        $syndicId = $user->syndic->id;

        $validated['syndic_id'] = $syndicId;

        $immeuble = Immeuble::create($validated);

        return response()->json([
            'message' => 'Immeuble créé avec succès',
            'immeuble' => $immeuble,
        ], 201);
    }

    /**
     * Met à jour un immeuble existant.
     */
    public function update(Request $request, string $id)
    {
        $authUser = Auth::user();

        if (!$authUser || !$authUser->syndic) {
            return response()->json(['message' => "Syndic introuvable pour l'utilisateur"], 403);
        }

        $immeuble = Immeuble::findOrFail($id);
        $syndicId = (int) $authUser->syndic->id;

        // Comparaison typée pour éviter les surprises
        if ((int) $immeuble->syndic_id !== $syndicId) {
            return response()->json(['message' => "Vous n'êtes pas autorisé à modifier cet immeuble"], 403);
        }

        // Valide seulement les champs modifiables
        $validated = $request->validate([
            'immeuble_name' => 'required|string',
            'address' => 'required|string',
        ]);

        $immeuble->update([
            'immeuble_name' => $validated['immeuble_name'],
            'address' => $validated['address'],
        ]);

        return response()->json([
            'message' => 'Immeuble mis à jour avec succès',
            'immeuble' => $immeuble->fresh(),
        ]);
    }


    /**
     * Supprime un immeuble.
     */
    public function destroy(Immeuble $immeuble)
    {
        $immeuble->delete();

        return response()->json([
            'message' => 'Immeuble supprimé avec succès',
        ]);
    }
}
