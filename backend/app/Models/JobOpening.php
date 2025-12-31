<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobOpening extends Model
{
    protected $fillable = [
        'title',
        'description',
        'department_id',
        'location',
        'deadline',
        'status',
    ];


     protected function casts(): array
    {
        return [
            'title' => 'string',
            'description' => 'string',
            'location' => 'string',
            'deadline' => 'date',
            'status' => 'string'
        ];
    }


    public function applications():HasMany{
        return $this->hasMany(JobApplication::class);
    }

    public function department():BelongsTo{
        return $this->belongsTo(Department::class);
    }

}
