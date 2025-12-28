<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
      'employee_id',
      'month',
      'gross',
      'deductions',
      'net_pay',
      'status',
      'payslip_link'
    ];

    protected function casts(): array
    {
        return [
            'employee_id'=> 'integer',
            'gross'=> 'decimal:2',
            'deductions'=> 'decimal:2',
            'net_pay'=> 'decimal:2',
            'sent_at' => 'datetime',
        ];
    }

    public function employee():BelongsTo {
        return $this->belongsTo(Employee::class);
    }
}
