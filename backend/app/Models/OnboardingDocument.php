<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnboardingDocument extends Model
{
    protected $fillable = [
        'onboarding_task_id',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'file_path' => 'string',
        ];
    }

    public function onboardingTask():BelongsTo
    {
        return $this->belongsTo(OnboardingTask::class,'onboarding_task_id');
    }
}
