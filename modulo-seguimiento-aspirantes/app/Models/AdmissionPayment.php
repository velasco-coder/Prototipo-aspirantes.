<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionPayment extends Model
{
    protected $fillable = [
        'applicant_id',
        'reference',
        'red_numbers',
        'amount',
        'status',
        'file_name',
        'observation',
        'uploaded_at',
        'validated_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'uploaded_at' => 'datetime',
            'validated_at' => 'datetime',
        ];
    }

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }
}
