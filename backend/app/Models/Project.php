<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function manager(){
    return $this->belongsTo(User::class, 'manager_id');
    }

    public function interns():BelongsToMany{
    return $this->belongsToMany(Intern::class, 'project_intern', 'project_id', 'intern_id');
    }

     public function employees(): BelongsToMany{
        return $this->belongsToMany(Employee::class,'project_employee','project_id','employee_id');
    }

    public function milestones(): HasMany{
        return $this->hasMany(Milestone::class);
    }
}
