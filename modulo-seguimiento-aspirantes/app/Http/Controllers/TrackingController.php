<?php

namespace App\Http\Controllers;

use App\Models\AdmissionPayment;
use App\Models\Applicant;
use App\Models\ApplicantDocument;
use App\Support\TrackingCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TrackingController extends Controller
{
    public function acknowledgeComputerNotice(Request $request): RedirectResponse
    {
        $applicant = $this->ownApplicant($request);

        $applicant->update(['computer_notice_acknowledged' => true]);

        return back()->with('success', 'Aviso confirmado. El tramite debe realizarse desde computadora para evitar errores.');
    }

    public function confirmSiiutemRegistration(Request $request): RedirectResponse
    {
        $applicant = $this->ownApplicant($request);

        $applicant->update([
            'siiutem_registration_confirmed' => true,
            'status' => 'ficha_pago_generada',
        ]);

        $applicant->payment()->firstOrCreate([], [
            'reference' => 'ADM-'.str_pad((string) $applicant->id, 4, '0', STR_PAD_LEFT),
            'red_numbers' => 'UTEM'.str_pad((string) $applicant->id, 5, '0', STR_PAD_LEFT),
            'amount' => 630,
            'status' => TrackingCatalog::PAYMENT_PENDING,
        ]);

        return back()->with('success', 'Registro en SIIUTEM confirmado y ficha de pago simulada.');
    }

    public function uploadPayment(Request $request): RedirectResponse
    {
        $applicant = $this->ownApplicant($request);
        $payment = $applicant->payment()->firstOrCreate([], [
            'reference' => 'ADM-'.str_pad((string) $applicant->id, 4, '0', STR_PAD_LEFT),
            'red_numbers' => 'UTEM'.str_pad((string) $applicant->id, 5, '0', STR_PAD_LEFT),
            'amount' => 630,
        ]);

        $payment->update([
            'status' => TrackingCatalog::PAYMENT_UPLOADED,
            'file_name' => 'comprobante-pago-'.$applicant->id.'.pdf',
            'observation' => null,
            'uploaded_at' => now(),
        ]);

        $applicant->update(['status' => 'pago_cargado']);

        return back()->with('success', 'Comprobante de pago cargado de forma simulada.');
    }

    public function uploadDocument(Request $request, ApplicantDocument $document): RedirectResponse
    {
        $this->assertOwnDocument($request, $document);

        $status = $document->status === TrackingCatalog::DOCUMENT_OBSERVED
            ? TrackingCatalog::DOCUMENT_CORRECTED
            : TrackingCatalog::DOCUMENT_UPLOADED;

        $document->update([
            'status' => $status,
            'file_name' => Str::slug($document->requiredDocument->name).'-'.$document->applicant_id.'.'.$document->requiredDocument->file_extension,
            'observation' => null,
            'uploaded_at' => now(),
        ]);

        $this->refreshApplicantStatus($document->applicant);

        return back()->with('success', 'Documento cargado de forma simulada.');
    }

    public function validatePayment(AdmissionPayment $payment): RedirectResponse
    {
        if (! in_array($payment->status, [TrackingCatalog::PAYMENT_UPLOADED, TrackingCatalog::PAYMENT_OBSERVED], true)) {
            return back()->with('error', 'Solo se puede validar un comprobante cargado u observado.');
        }

        $payment->update([
            'status' => TrackingCatalog::PAYMENT_VALIDATED,
            'observation' => null,
            'validated_at' => now(),
        ]);

        $this->refreshApplicantStatus($payment->applicant);

        return back()->with('success', 'Pago validado.');
    }

    public function observePayment(Request $request, AdmissionPayment $payment): RedirectResponse
    {
        $data = $request->validate([
            'observation' => ['nullable', 'string', 'max:500'],
        ]);

        $payment->update([
            'status' => TrackingCatalog::PAYMENT_OBSERVED,
            'observation' => $data['observation'] ?: 'No se identifican correctamente los numeros rojos en el concepto de pago.',
        ]);

        $payment->applicant->update(['status' => 'pago_observado']);

        return back()->with('success', 'Pago observado para correccion.');
    }

    public function prevalidateDocument(ApplicantDocument $document): RedirectResponse
    {
        if (! in_array($document->status, [TrackingCatalog::DOCUMENT_UPLOADED, TrackingCatalog::DOCUMENT_CORRECTED], true)) {
            return back()->with('error', 'Solo se pueden prevalidad documentos cargados o corregidos.');
        }

        $document->update([
            'status' => TrackingCatalog::DOCUMENT_PREVALIDATED,
            'observation' => null,
            'prevalidated_at' => now(),
        ]);

        $this->refreshApplicantStatus($document->applicant);

        return back()->with('success', 'Documento prevalidado.');
    }

    public function validateDocument(ApplicantDocument $document): RedirectResponse
    {
        if (! in_array($document->status, [TrackingCatalog::DOCUMENT_PREVALIDATED, TrackingCatalog::DOCUMENT_UPLOADED, TrackingCatalog::DOCUMENT_CORRECTED], true)) {
            return back()->with('error', 'El documento debe estar cargado, corregido o prevalidado.');
        }

        $document->update([
            'status' => TrackingCatalog::DOCUMENT_VALIDATED,
            'observation' => null,
            'validated_at' => now(),
        ]);

        $this->refreshApplicantStatus($document->applicant);

        return back()->with('success', 'Documento validado oficialmente.');
    }

    public function observeDocument(Request $request, ApplicantDocument $document): RedirectResponse
    {
        $data = $request->validate([
            'observation' => ['nullable', 'string', 'max:500'],
        ]);

        $document->update([
            'status' => TrackingCatalog::DOCUMENT_OBSERVED,
            'observation' => $data['observation'] ?: 'El documento no corresponde, esta incompleto o no es legible.',
        ]);

        $document->applicant->update(['status' => 'documentos_observados']);

        return back()->with('success', 'Documento observado para correccion.');
    }

    public function sendCenevalInstructions(Request $request, Applicant $applicant): RedirectResponse
    {
        $applicant->load(['payment', 'documents']);

        if (! $applicant->canReceiveCenevalInstructions()) {
            return back()->with('error', 'Para enviar indicaciones primero debe validarse pago y documentacion.');
        }

        $body = "Tu documentacion fue validada. Ahora debes solicitar CENEVAL, llenar los cuestionarios requeridos y descargar tu pase de examen.";

        $applicant->emailLogs()->create([
            'sent_by' => $request->user()->id,
            'recipient_email' => $applicant->email,
            'subject' => 'Indicaciones para solicitar examen CENEVAL',
            'body' => $body,
            'sent_at' => now(),
        ]);

        $applicant->update([
            'status' => 'correo_indicaciones_enviado',
            'ceneval_instructions_sent_at' => now(),
        ]);

        return back()->with('success', 'Correo de indicaciones registrado de forma simulada.');
    }

    private function ownApplicant(Request $request): Applicant
    {
        return $request->user()
            ->applicant()
            ->with(['payment', 'documents.requiredDocument'])
            ->firstOrFail();
    }

    private function assertOwnDocument(Request $request, ApplicantDocument $document): void
    {
        abort_unless($document->applicant->user_id === $request->user()->id, 403);
    }

    private function refreshApplicantStatus(Applicant $applicant): void
    {
        $applicant->load(['payment', 'documents']);

        if ($applicant->payment?->status === TrackingCatalog::PAYMENT_OBSERVED || $applicant->hasObservedItems()) {
            $applicant->update(['status' => $applicant->payment?->status === TrackingCatalog::PAYMENT_OBSERVED ? 'pago_observado' : 'documentos_observados']);
            return;
        }

        if ($applicant->payment?->status === TrackingCatalog::PAYMENT_VALIDATED && $applicant->allDocumentsValidated()) {
            $applicant->update(['status' => 'documentos_validados_escolares']);
            return;
        }

        if ($applicant->documents->isNotEmpty() && $applicant->documents->every(fn (ApplicantDocument $document) => $document->status === TrackingCatalog::DOCUMENT_PREVALIDATED || $document->status === TrackingCatalog::DOCUMENT_VALIDATED)) {
            $applicant->update(['status' => 'documentos_prevalidados']);
            return;
        }

        if ($applicant->documents->contains(fn (ApplicantDocument $document) => in_array($document->status, [TrackingCatalog::DOCUMENT_UPLOADED, TrackingCatalog::DOCUMENT_CORRECTED], true))) {
            $applicant->update(['status' => 'documentos_cargados']);
            return;
        }

        if ($applicant->payment?->status === TrackingCatalog::PAYMENT_VALIDATED) {
            $applicant->update(['status' => 'pago_validado']);
        }
    }
}
