<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Syndic extends Model
{
    use HasFactory;

    protected $fillable = ['phone', 'user_id'];

// ... autres imports ...
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function immeuble()
    {
        return $this->hasOne(Immeuble::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}