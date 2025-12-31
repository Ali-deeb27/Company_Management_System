<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferLetter extends Model
{
    protected $fillable = [
        'job_application_id',
        'offer_date',
        'salary',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'offer_date' => 'date',
            'salary' => 'decimal:2',
            'status' => 'string'
        ];
    }

    public function jobApplication():BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }

}