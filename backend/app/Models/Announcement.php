<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'message',
        'target_type'
    ];

    protected $casts = [
        'title' => 'string',
        'message' => 'string',
        'target_type' => 'string',
    ];

}
