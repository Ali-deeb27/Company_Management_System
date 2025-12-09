<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternEvaluation extends Model
{
     protected $fillable = [
        'intern_id', 
        'mentor_id', 
        'rating',
        'comments', 
        'evaluation_date'
    ];

    protected function casts(): array
    {
        return [
            'intern_id'=> 'integer',
            'mentor_id'=> 'integer',
            'rating'=> 'integer',
            'evaluation_date'=>'date',
        ];
    }

    public function intern():BelongsTo {
        return $this->belongsTo(Intern::class);
    }

    public function mentor():BelongsTo {
        return $this->belongsTo(Employee::class, 'mentor_id');
    }

}
