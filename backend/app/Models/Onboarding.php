<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Onboarding extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'start_date',
        'status',
    ];

     protected function casts(): array
    {
        return [
            'type' => 'string',
            'start_date' => 'datetime',
            'status' => 'string'
        ];
    }

     public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks():HasMany
    {
        return $this->hasMany(OnboardingTask::class);
    }
}
