<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promotion extends Model
{
     protected $fillable = [
        'employee_id',
        'old_position',
        'new_position',
        'promotion_date'
    ];

     protected function casts(): array
    {
        return [
            'employee_id'=> 'integer',
            'promotion_date'=> 'date',
        ];
    }

      public function employee():BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
