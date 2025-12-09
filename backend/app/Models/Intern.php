<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Hash;

class Intern extends Model
{
     protected $fillable = [
      'user_id',
      'department_id',
      'mentor_id',
      'start_date',
      'end_date',
      'status',
    ];

    protected function casts(): array
    {
        return [
            'user_id'=> 'integer',
            'department_id'=> 'integer',
            'mentor_id'=> 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function user():BelongsTo {
        return $this->belongsTo(User::class);
    }

     public function department():BelongsTo {
        return $this->belongsTo(Department::class);
    }

    public function mentor():BelongsTo {
        return $this->belongsTo(Employee::class, 'mentor_id');
    }

    public function progress():HasMany
{
    return $this->hasMany(InternProgress::class);
}

public function evaluations():HasMany
{
    return $this->hasMany(InternEvaluation::class);
}

}
