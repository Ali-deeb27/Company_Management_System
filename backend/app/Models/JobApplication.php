<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobApplication extends Model
{
    protected $fillable = [
        'job_opening_id',
        'user_id',
        'cv_path',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'cv_path' => 'string',
            'status' => 'string'
        ];
    }

    public function jobOpening():BelongsTo
    {
        return $this->belongsTo(JobOpening::class);
    }

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function interviews():HasMany
    {
        return $this->hasMany(Interview::class);
    }

    public function offerLetter():HasOne
    {
        return $this->hasOne(OfferLetter::class);
    }
}