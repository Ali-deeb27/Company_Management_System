<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
      'name',
      'department_id',
      'budget',
      'start_date',
      'end_date',
      'status',
    ];

    protected function casts(): array
    {
        return [
            'department_id'=> 'integer',
            'budget'=> 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

     public function department():BelongsTo {
        return $this->belongsTo(Department::class);
    }

     public function tasks():HasMany {
        return $this->hasMany(Task::class);
    }

    public function internshipPositions():HasMany {
        return $this->hasMany(InternshipPosition::class);
    }



}
