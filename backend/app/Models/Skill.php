<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Skill extends Model
{
     protected $fillable = [
        'employee_id',
        'skill_name',
        'level'
    ];

    protected function casts(): array
    {
        return [
            'employee_id'=> 'integer',
        ];
    }

     public function employee():BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

}
