<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountingEntry extends Model
{
    protected $fillable = [
        'payroll_id',
        'type',
        'amount',
        'direction',
        'entry_date',
    ];

    public function payroll()
    {
        return $this->belongsTo(Payroll::class);
    }
}
