<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternCertificate extends Model
{
      protected $fillable = [
        'intern_id',
        'certificate_path',
        'issued_at',
        'issued_by',
    ];

    protected function casts(): array
    {
        return [
            'intern_id'=> 'integer',
            'issued_at' => 'date',
            'issued_by'=> 'integer',
        ];
    }

    public function intern():BelongsTo
    {
        return $this->belongsTo(Intern::class);
    }

    public function issuer():BelongsTo
    {
        return $this->belongsTo(Employee::class, 'issued_by');
    }

}
