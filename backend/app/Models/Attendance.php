<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $table = 'attendance';
     protected $fillable = [
      'user_id',
      'date',
      'check_in',
      'check_out',
      'hours_worked',
    ];

    protected function casts(): array
    {
        return [
            'user_id'=> 'integer',
            'date' => 'date',
            'check_in' => 'datetime:H:i:s',
            'check_out' => 'datetime:H:i:s',
            'hours_worked'=> 'integer',
        ]; 
    }

     public function user():BelongsTo {
        return $this->belongsTo(User::class);
    }
}
