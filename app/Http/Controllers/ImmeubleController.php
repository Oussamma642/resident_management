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
    public function update(Request $request, Immeuble $immeuble)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
        ]);

        $immeuble->update($validated);

        return response()->json([
            'message' => 'Immeuble mis à jour avec succès',
            'immeuble' => $immeuble,
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
