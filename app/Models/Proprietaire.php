<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proprietaire extends Model
{
    use HasFactory;
    protected $fillable = ['phone', 'etage', 'numero_appartement', 'immeuble_id', 'user_id'];
    // ... autres imports ...
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function immeuble()
    {
        return $this->belongsTo(Immeuble::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}