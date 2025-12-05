<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certification extends Model
{
    protected $fillable = [
        'employee_id',
        'title',
        'issued_by',
        'issued_at',
        'expires_at'
    ];

    protected function casts(): array
    {
        return [
            'employee_id'=> 'integer',
            'issued_at'=> 'date',
            'expires_at'=> 'date',
        ];
    }

    public function employee():BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

}
