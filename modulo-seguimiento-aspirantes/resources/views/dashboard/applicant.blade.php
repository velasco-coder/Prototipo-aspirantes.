@extends('layouts.app')

@section('title', 'Panel del aspirante')

@section('content')
    @php
        $payment = $applicant->payment;
        $statusClass = str_contains($applicant->status, 'observado') ? 'red' : (str_contains($applicant->status, 'validado') || str_contains($applicant->status, 'enviado') ? 'green' : 'amber');
    @endphp

    <section class="panel">
        <div class="actions" style="justify-content: space-between;">
            <div>
                <h2>Panel del aspirante</h2>
                <p class="muted">Modulo complementario: el registro y ficha oficial siguen en SIIUTEM.</p>
            </div>
            <a class="button secondary" href="https://wa.me/523141466523" target="_blank" rel="noopener">Preguntas por WhatsApp</a>
        </div>
    </section>

    @unless ($applicant->computer_notice_acknowledged)
        <section class="notice warning">
            <strong>Importante:</strong> realiza el tramite desde una computadora. En celular o tableta algunas paginas pueden no ser compatibles.
            <form method="POST" action="{{ route('applicant.computer-notice') }}" style="margin-top: 10px;">
                @csrf
                <button class="button small" type="submit">Entendido</button>
            </form>
        </section>
    @endunless

    <section class="panel">
        <div class="actions" style="justify-content: space-between;">
            <div>
                <h3>{{ $applicant->full_name }}</h3>
                <p class="muted">{{ $applicant->folio }} · {{ $applicant->curp }} · {{ $applicant->career_interest }}</p>
            </div>
            <span class="badge {{ $statusClass }}">{{ $labels['statuses'][$applicant->status] ?? $applicant->status }}</span>
        </div>
    </section>

    <section class="grid two">
        <div class="panel">
            <h3>1. Registro y ficha oficial</h3>
            <p>Primero confirma tu registro y ficha en los portales oficiales de SIIUTEM.</p>
            <div class="actions">
                <a class="button secondary" href="{{ $links['registration'] }}" target="_blank" rel="noopener">Registro SIIUTEM</a>
                <a class="button secondary" href="{{ $links['ceneval_payment'] }}" target="_blank" rel="noopener">Ficha CENEVAL</a>
                <form method="POST" action="{{ route('applicant.siiutem.confirm') }}">
                    @csrf
                    <button class="button" type="submit" @disabled($applicant->siiutem_registration_confirmed)>Ya hice mi registro</button>
                </form>
            </div>
        </div>

        <div class="panel">
            <h3>2. Pago de admision</h3>
            <p><strong>Monto:</strong> ${{ number_format((float) $applicant->admissionPeriod->admission_fee, 2) }}</p>
            <p><strong>Referencia:</strong> {{ $payment?->reference ?? 'Pendiente' }}</p>
            <p><strong>Numeros rojos:</strong> {{ $payment?->red_numbers ?? 'Pendiente' }}</p>
            <p><strong>Estatus:</strong> {{ $labels['payments'][$payment?->status ?? 'pendiente'] ?? 'Pendiente' }}</p>
            <p class="muted">Si pagas por transferencia o Santander, coloca los numeros rojos en el concepto. Si no los colocas, el pago puede rebotarse o no reflejarse.</p>
            @if ($payment?->observation)
                <div class="notice error">{{ $payment->observation }}</div>
            @endif
            <form method="POST" action="{{ route('applicant.payment.upload') }}">
                @csrf
                <button class="button" type="submit" @disabled(! $applicant->siiutem_registration_confirmed || $payment?->status === 'validado')>Subir comprobante PDF</button>
            </form>
        </div>
    </section>

    <section class="panel">
        <h3>3. Documentos requeridos</h3>
        @foreach ($applicant->documents->sortBy('requiredDocument.sort_order') as $document)
            <div class="doc-row">
                <div>
                    <strong>{{ $document->requiredDocument->name }}</strong>
                    <div class="muted">
                        Formato .{{ $document->requiredDocument->file_extension }}
                        · {{ $document->file_name ?? 'Sin archivo' }}
                        · {{ $labels['documents'][$document->status] ?? $document->status }}
                    </div>
                    <div class="muted">{{ $document->requiredDocument->instructions }}</div>
                    @if ($document->observation)
                        <div class="notice error" style="margin-top: 8px;">{{ $document->observation }}</div>
                    @endif
                </div>
                <form method="POST" action="{{ route('applicant.documents.upload', $document) }}">
                    @csrf
                    <button class="button small secondary" type="submit" @disabled(! $applicant->siiutem_registration_confirmed || in_array($document->status, ['prevalidado', 'validado'], true))>
                        {{ $document->status === 'observado' ? 'Corregir' : 'Subir' }}
                    </button>
                </form>
            </div>
        @endforeach
    </section>

    <section class="panel">
        <h3>4. Indicaciones finales CENEVAL</h3>
        @if ($applicant->ceneval_instructions_sent_at)
            <p>Escolares ya registro el envio de indicaciones el {{ $applicant->ceneval_instructions_sent_at->format('d/m/Y H:i') }}.</p>
        @else
            <p class="muted">Cuando Escolares valide pago y documentos, se registrara el envio de indicaciones para solicitar CENEVAL, llenar cuestionarios y descargar pase de examen.</p>
        @endif
    </section>
@endsection
