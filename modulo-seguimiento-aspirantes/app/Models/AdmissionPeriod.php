<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionPeriod extends Model
{
    protected $fillable = [
        'name',
        'starts_on',
        'ends_on',
        'admission_fee',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'ends_on' => 'date',
            'admission_fee' => 'decimal:2',
            'active' => 'boolean',
        ];
    }
}
