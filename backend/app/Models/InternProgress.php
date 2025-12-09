<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternProgress extends Model
{
    protected $table = 'intern_progess';
    protected $fillable = [
        'intern_id', 
        'created_by', 
        'title', 
        'description', 
        'progress_date'
    ];

     protected function casts(): array
    {
        return [
            'intern_id'=> 'integer',
            'created_by'=> 'integer',
            'progress_date' => 'date',
        ];
    }

     public function intern():BelongsTo {
        return $this->belongsTo(Intern::class);
    }

    public function creator():BelongsTo {
        return $this->belongsTo(Employee::class, 'created_by');
    }
}
