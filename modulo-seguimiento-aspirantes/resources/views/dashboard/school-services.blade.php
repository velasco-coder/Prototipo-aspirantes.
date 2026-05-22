@extends('layouts.app')

@section('title', 'Panel de Escolares')

@section('content')
    <section class="panel">
        <div class="actions" style="justify-content: space-between;">
            <div>
                <h2>Panel de Escolares</h2>
                <p class="muted">Seguimiento complementario para pago, documentos e indicaciones previas a CENEVAL.</p>
            </div>
            <div class="actions">
                <a class="button secondary" href="{{ $links['registration'] }}" target="_blank" rel="noopener">Registro SIIUTEM</a>
                <a class="button secondary" href="{{ $links['ceneval_payment'] }}" target="_blank" rel="noopener">Ficha CENEVAL</a>
            </div>
        </div>
    </section>

    <section class="grid three">
        <div class="metric"><strong>{{ $applicants->count() }}</strong><span>Aspirantes en seguimiento</span></div>
        <div class="metric"><strong>{{ $applicants->filter(fn ($a) => $a->hasObservedItems())->count() }}</strong><span>Con observaciones</span></div>
        <div class="metric"><strong>{{ $applicants->whereNotNull('ceneval_instructions_sent_at')->count() }}</strong><span>Correos registrados</span></div>
    </section>

    <section class="panel">
        <form method="GET" action="{{ route('school-services.index') }}" class="grid two">
            <div class="field">
                <label for="buscar">Buscar por nombre, CURP, correo o folio</label>
                <input id="buscar" name="buscar" value="{{ $search }}" placeholder="Ej. CURP o nombre completo">
            </div>
            <div class="actions" style="align-items: end;">
                <button class="button" type="submit">Buscar</button>
                <a class="button secondary" href="{{ route('school-services.index') }}">Limpiar</a>
            </div>
        </form>
    </section>

    @foreach ($applicants as $applicant)
        @php
            $payment = $applicant->payment;
            $statusClass = str_contains($applicant->status, 'observado') ? 'red' : (str_contains($applicant->status, 'validado') || str_contains($applicant->status, 'enviado') ? 'green' : 'amber');
        @endphp
        <section class="panel">
            <div class="actions" style="justify-content: space-between;">
                <div>
                    <h3>{{ $applicant->full_name }}</h3>
                    <p class="muted">{{ $applicant->folio }} · {{ $applicant->curp }} · {{ $applicant->email }}</p>
                    <p class="muted">{{ $applicant->career_interest }} · {{ $applicant->high_school }} · Promedio {{ $applicant->average ?? 'N/D' }}</p>
                </div>
                <span class="badge {{ $statusClass }}">{{ $labels['statuses'][$applicant->status] ?? $applicant->status }}</span>
            </div>

            <div class="grid two">
                <div>
                    <h3>Pago</h3>
                    <p><strong>Referencia:</strong> {{ $payment?->reference ?? 'Sin referencia' }}</p>
                    <p><strong>Numeros rojos:</strong> {{ $payment?->red_numbers ?? 'Sin dato' }}</p>
                    <p><strong>Estatus:</strong> {{ $labels['payments'][$payment?->status ?? 'pendiente'] ?? 'Pendiente' }}</p>
                    @if ($payment?->file_name)
                        <p class="muted">{{ $payment->file_name }}</p>
                    @endif
                    @if ($payment?->observation)
                        <div class="notice error">{{ $payment->observation }}</div>
                    @endif
                    @if ($payment)
                        <div class="actions">
                            <form method="POST" action="{{ route('school-services.payments.validate', $payment) }}">
                                @csrf
                                <button class="button small success" type="submit" @disabled(! in_array($payment->status, ['comprobante_cargado', 'observado'], true))>Validar pago</button>
                            </form>
                            <form method="POST" action="{{ route('school-services.payments.observe', $payment) }}" class="actions">
                                @csrf
                                <input name="observation" placeholder="Observacion" style="width: 220px;">
                                <button class="button small danger" type="submit" @disabled(! in_array($payment->status, ['comprobante_cargado', 'validado'], true))>Observar</button>
                            </form>
                        </div>
                    @endif
                </div>

                <div>
                    <h3>Indicaciones CENEVAL</h3>
                    <p class="muted">Se habilita cuando pago y documentos estan validados.</p>
                    <form method="POST" action="{{ route('school-services.instructions.send', $applicant) }}">
                        @csrf
                        <button class="button small" type="submit" @disabled(! $applicant->canReceiveCenevalInstructions() || $applicant->ceneval_instructions_sent_at)>
                            Registrar envio de correo
                        </button>
                    </form>
                    @if ($applicant->ceneval_instructions_sent_at)
                        <p class="muted">Enviado: {{ $applicant->ceneval_instructions_sent_at->format('d/m/Y H:i') }}</p>
                    @endif
                </div>
            </div>

            <h3>Documentos</h3>
            @foreach ($applicant->documents->sortBy('requiredDocument.sort_order') as $document)
                <div class="doc-row">
                    <div>
                        <strong>{{ $document->requiredDocument->name }}</strong>
                        <div class="muted">
                            Formato .{{ $document->requiredDocument->file_extension }}
                            · {{ $document->file_name ?? 'Sin archivo' }}
                            · {{ $labels['documents'][$document->status] ?? $document->status }}
                        </div>
                        @if ($document->observation)
                            <div class="notice error" style="margin-top: 8px;">{{ $document->observation }}</div>
                        @endif
                    </div>
                    <div class="actions">
                        <form method="POST" action="{{ route('school-services.documents.prevalidate', $document) }}">
                            @csrf
                            <button class="button small secondary" type="submit" @disabled(! in_array($document->status, ['cargado', 'corregido'], true))>Prevalidar</button>
                        </form>
                        <form method="POST" action="{{ route('school-services.documents.validate', $document) }}">
                            @csrf
                            <button class="button small success" type="submit" @disabled(! in_array($document->status, ['cargado', 'corregido', 'prevalidado'], true))>Validar</button>
                        </form>
                        <form method="POST" action="{{ route('school-services.documents.observe', $document) }}" class="actions">
                            @csrf
                            <input name="observation" placeholder="Observacion" style="width: 220px;">
                            <button class="button small danger" type="submit" @disabled(! in_array($document->status, ['cargado', 'corregido', 'prevalidado', 'validado'], true))>Observar</button>
                        </form>
                    </div>
                </div>
            @endforeach
        </section>
    @endforeach
@endsection
