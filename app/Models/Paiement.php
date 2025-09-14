<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = ["proprietaire_id", "syndic_id", "immeuble_id", "date_paiement", "montant", "status"];

    // ... autres imports ...
    public function proprietaire()
    {
        return $this->belongsTo(Proprietaire::class);
    }

    public function syndic()
    {
        return $this->belongsTo(Syndic::class);
    }

    public function immeuble()
    {
        return $this->belongsTo(Immeuble::class);
    }
}
