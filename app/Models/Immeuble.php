<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Immeuble extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'address', 'syndic_id'];

    // ... autres imports ...
    public function syndic()
    {
        return $this->belongsTo(Syndic::class);
    }

    public function proprietaires()
    {
        return $this->hasMany(Proprietaire::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}