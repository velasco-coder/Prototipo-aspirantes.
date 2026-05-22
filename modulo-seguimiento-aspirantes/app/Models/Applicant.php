<?php

namespace App\Models;

use App\Support\TrackingCatalog;
use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    protected $fillable = [
        'user_id',
        'admission_period_id',
        'folio',
        'curp',
        'full_name',
        'email',
        'phone',
        'career_interest',
        'high_school',
        'average',
        'status',
        'siiutem_registration_confirmed',
        'computer_notice_acknowledged',
        'ceneval_instructions_sent_at',
        'internal_notes',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'average' => 'decimal:2',
            'siiutem_registration_confirmed' => 'boolean',
            'computer_notice_acknowledged' => 'boolean',
            'ceneval_instructions_sent_at' => 'datetime',
            'active' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function admissionPeriod()
    {
        return $this->belongsTo(AdmissionPeriod::class);
    }

    public function payment()
    {
        return $this->hasOne(AdmissionPayment::class);
    }

    public function documents()
    {
        return $this->hasMany(ApplicantDocument::class);
    }

    public function emailLogs()
    {
        return $this->hasMany(GuidanceEmailLog::class);
    }

    public function allDocumentsValidated(): bool
    {
        return $this->documents->isNotEmpty()
            && $this->documents->every(fn (ApplicantDocument $document) => $document->status === TrackingCatalog::DOCUMENT_VALIDATED);
    }

    public function hasObservedItems(): bool
    {
        return $this->documents->contains(fn (ApplicantDocument $document) => $document->status === TrackingCatalog::DOCUMENT_OBSERVED)
            || $this->payment?->status === TrackingCatalog::PAYMENT_OBSERVED;
    }

    public function canReceiveCenevalInstructions(): bool
    {
        return $this->payment?->status === TrackingCatalog::PAYMENT_VALIDATED && $this->allDocumentsValidated();
    }
}
