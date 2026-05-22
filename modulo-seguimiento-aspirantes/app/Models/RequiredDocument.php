<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequiredDocument extends Model
{
    protected $fillable = [
        'code',
        'name',
        'instructions',
        'file_extension',
        'is_required',
        'sort_order',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'active' => 'boolean',
        ];
    }
}
