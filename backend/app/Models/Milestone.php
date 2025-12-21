<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Milestone extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'description',
        'due_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'project_id' => 'integer',
            'due_date' => 'date',
        ];
    }
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
