<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicantDocument extends Model
{
    protected $fillable = [
        'applicant_id',
        'required_document_id',
        'status',
        'file_name',
        'observation',
        'uploaded_at',
        'prevalidated_at',
        'validated_at',
    ];

    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
            'prevalidated_at' => 'datetime',
            'validated_at' => 'datetime',
        ];
    }

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }

    public function requiredDocument()
    {
        return $this->belongsTo(RequiredDocument::class);
    }
}
