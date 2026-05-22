<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuidanceEmailLog extends Model
{
    protected $fillable = [
        'applicant_id',
        'sent_by',
        'recipient_email',
        'subject',
        'body',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sent_by');
    }
}
