<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternApplication extends Model
{
     protected $fillable = [
        'user_id',
        'department_id',
        'cover_letter',
        'cv',
        'status',
        'approved_by'
    ];

     protected function casts(): array
    {
        return [
            'user_id'=> 'integer',
            'department_id'=> 'integer',
            'approved_by'=> 'integer',
        ];
    }

     public function user():BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function department():BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function approvedBy():BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

}
