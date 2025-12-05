<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmploymentHistory extends Model
{
    protected $fillable = [
        'employee_id',
        'position_title',
        'department',
        'start_date',
        'end_date',
    ];

    protected function casts(): array
    {
        return [
            'employee_id'=> 'integer',
            'start_date'=> 'date',
            'end_date'=> 'date',
        ];
    }

    public function employee():BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }


}
