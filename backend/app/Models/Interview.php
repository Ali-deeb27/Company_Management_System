<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Interview extends Model
{
    protected $fillable = [
        'job_application_id',
        'scheduled_at',
        'location',
        'interviewer_id',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'location' => 'string',
            'status' => 'string'
        ];
    }

     public function jobApplication():BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }

    public function interviewer():BelongsTo
    {
        return $this->belongsTo(Employee::class, 'interviewer_id');
    }

    public function evaluation():HasOne
    {
        return $this->hasOne(Evaluation::class);
    }
}
