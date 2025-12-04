<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Document extends Model
{
    protected $fillable = [
      'title',
      'link',
      'uploaded_by',
      'associated_entity',
    ];

    protected function casts(): array
    {
        return [
            'uploaded_by'=> 'integer',
        ];
    }

    public function uploader():BelongsTo {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

}
