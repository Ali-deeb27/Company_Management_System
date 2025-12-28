<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryComponent extends Model
{
    protected $fillable = [
        'employee_id',
        'type',
        'name',
        'amount',
        'is_taxable',
        'is_recurring',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
