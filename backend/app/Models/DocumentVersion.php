<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentVersion extends Model
{
    protected $fillable = [
        'document_id',
        'version_number',
        'file_path',
        'uploaded_by',
        'change_log'
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function uploader(){
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
