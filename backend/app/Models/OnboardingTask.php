<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OnboardingTask extends Model
{
    protected $fillable = [
        'onboarding_id',
        'title',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'title' => 'string',
            'description' => 'string',
            'status' => 'string'
        ];
    }

     public function onboarding():BelongsTo
    {
        return $this->belongsTo(Onboarding::class);
    }

    public function documents():HasMany
    {
        return $this->hasMany(OnboardingDocument::class);
    }
}
