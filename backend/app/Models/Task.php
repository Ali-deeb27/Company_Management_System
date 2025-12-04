<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
      'project_id',
      'title',
      'assignee_id',
      'description',
      'status',
      'start_date',
      'end_date',
    ];

    protected function casts(): array
    {
        return [
            'project_id'=> 'integer',
            'assignee_id'=> 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function project():BelongsTo {
        return $this->belongsTo(Project::class);
    }

    public function assignee():BelongsTo {
        return $this->belongsTo(User::class, 'assignee_id');
    }

}
