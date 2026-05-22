<?php

namespace App\Support;

class TrackingCatalog
{
    public const ROLE_APPLICANT = 'aspirante';
    public const ROLE_SCHOOL_SERVICES = 'escolares';

    public const PAYMENT_PENDING = 'pendiente';
    public const PAYMENT_UPLOADED = 'comprobante_cargado';
    public const PAYMENT_OBSERVED = 'observado';
    public const PAYMENT_VALIDATED = 'validado';

    public const DOCUMENT_PENDING = 'pendiente';
    public const DOCUMENT_UPLOADED = 'cargado';
    public const DOCUMENT_OBSERVED = 'observado';
    public const DOCUMENT_CORRECTED = 'corregido';
    public const DOCUMENT_PREVALIDATED = 'prevalidado';
    public const DOCUMENT_VALIDATED = 'validado';

    public static function roleLabels(): array
    {
        return [
            self::ROLE_APPLICANT => 'Aspirante',
            self::ROLE_SCHOOL_SERVICES => 'Escolares',
        ];
    }

    public static function statusLabels(): array
    {
        return [
            'registrado_siiutem' => 'Registrado en SIIUTEM',
            'ficha_pago_generada' => 'Ficha de pago generada',
            'pago_pendiente' => 'Pago pendiente',
            'pago_cargado' => 'Comprobante de pago cargado',
            'pago_observado' => 'Pago observado',
            'pago_validado' => 'Pago validado',
            'documentos_pendientes' => 'Documentos pendientes',
            'documentos_cargados' => 'Documentos cargados',
            'documentos_observados' => 'Documentos observados',
            'documentos_corregidos' => 'Documentos corregidos',
            'documentos_prevalidados' => 'Documentos prevalidados',
            'documentos_validados_escolares' => 'Documentos validados por Escolares',
            'correo_indicaciones_enviado' => 'Correo de indicaciones enviado',
            'cuestionarios_ceneval_pendientes' => 'Cuestionarios CENEVAL pendientes',
            'pase_ceneval_generado' => 'Pase CENEVAL generado',
            'listo_para_examen' => 'Listo para examen',
            'proceso_cancelado' => 'Proceso cancelado',
        ];
    }

    public static function paymentLabels(): array
    {
        return [
            self::PAYMENT_PENDING => 'Pendiente',
            self::PAYMENT_UPLOADED => 'Comprobante cargado',
            self::PAYMENT_OBSERVED => 'Observado',
            self::PAYMENT_VALIDATED => 'Validado',
        ];
    }

    public static function documentLabels(): array
    {
        return [
            self::DOCUMENT_PENDING => 'Pendiente',
            self::DOCUMENT_UPLOADED => 'Cargado',
            self::DOCUMENT_OBSERVED => 'Observado',
            self::DOCUMENT_CORRECTED => 'Corregido',
            self::DOCUMENT_PREVALIDATED => 'Prevalidado',
            self::DOCUMENT_VALIDATED => 'Validado',
        ];
    }

    public static function officialLinks(): array
    {
        return [
            'registration' => 'https://siiutem.utem.edu.mx/preinscripciones/registrar',
            'ceneval_payment' => 'https://siiutem.utem.edu.mx/ceneval',
        ];
    }

    public static function homeRouteForRole(string $role): string
    {
        return $role === self::ROLE_SCHOOL_SERVICES ? 'school-services.index' : 'applicant.index';
    }
}
