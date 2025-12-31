<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    protected $fillable = [
        'interview_id',
        'score',
        'comments',
        'recommended'
    ];

    protected function casts(): array
    {
        return [
            'comments' => 'string',
            'recommended' => 'boolean'
        ];
    }

    public function interview():BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }
}
