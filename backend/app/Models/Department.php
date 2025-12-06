<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Department extends Model
{
    protected $fillable = [
        'name',
        'manager_id',
        'description'
    ];

    protected function casts(): array
    {
        return [
            'manager_id'=> 'integer',
        ];
    }


    public function manager():BelongsTo {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function users():HasMany {
        return $this->hasMany(User::class);
    }

     public function interns():HasMany {
        return $this->hasMany(Intern::class);
    }

    public function projects():HasMany {
        return $this->hasMany(Project::class);
    }

    public function internshipPositions():HasMany {
        return $this->hasMany(InternshipPosition::class);
    }

}
