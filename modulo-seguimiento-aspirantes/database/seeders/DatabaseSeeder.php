<?php

namespace Database\Seeders;

use App\Models\AdmissionPeriod;
use App\Models\Applicant;
use App\Models\RequiredDocument;
use App\Models\User;
use App\Support\TrackingCatalog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $users = $this->createUsers();
        $period = AdmissionPeriod::updateOrCreate(['name' => 'Convocatoria mayo-agosto 2026'], [
            'name' => 'Convocatoria mayo-agosto 2026',
            'starts_on' => '2026-05-06',
            'ends_on' => '2026-08-11',
            'admission_fee' => 630,
            'active' => true,
        ]);
        $documents = $this->createRequiredDocuments();

        $applicants = $this->createApplicants($period, $users['aspirante']);

        $this->attachDocuments($applicants[0], $documents, TrackingCatalog::DOCUMENT_PENDING);
        $this->attachDocuments($applicants[1], $documents, TrackingCatalog::DOCUMENT_UPLOADED);
        $this->attachDocuments($applicants[2], $documents, TrackingCatalog::DOCUMENT_OBSERVED);

        $this->createPayments($applicants);
    }

    private function createUsers(): array
    {
        return [
            'aspirante' => User::updateOrCreate(['email' => 'aspirante@utem.test'], [
                'name' => 'Mariana Lopez Ramirez',
                'email' => 'aspirante@utem.test',
                'role' => TrackingCatalog::ROLE_APPLICANT,
                'phone' => '3142223344',
                'password' => 'Aspirante123',
            ]),
            'escolares' => User::updateOrCreate(['email' => 'escolares@utem.test'], [
                'name' => 'Responsable de Escolares',
                'email' => 'escolares@utem.test',
                'role' => TrackingCatalog::ROLE_SCHOOL_SERVICES,
                'phone' => '3141466523',
                'password' => 'Escolares123',
            ]),
        ];
    }

    private function createRequiredDocuments(): Collection
    {
        return collect([
            [
                'code' => 'certificado_constancia_promedio',
                'name' => 'Certificado de bachillerato / constancia de estudios con promedio',
                'instructions' => 'Si ya egresaste, sube certificado. Si aun estudias, sube constancia con promedio, grado, grupo, semestre y escuela de procedencia.',
                'file_extension' => 'pdf',
                'sort_order' => 1,
            ],
            [
                'code' => 'identificacion',
                'name' => 'Identificacion oficial, credencial escolar o certificado de estudios con foto',
                'instructions' => 'Puede ser INE, pasaporte, credencial escolar o constancia/certificado con fotografia.',
                'file_extension' => 'pdf',
                'sort_order' => 2,
            ],
            [
                'code' => 'comprobante_pago',
                'name' => 'Comprobante de pago',
                'instructions' => 'Si pagaste en linea, convierte la captura a PDF. Si pagaste fisicamente, escanea el recibo.',
                'file_extension' => 'pdf',
                'sort_order' => 3,
            ],
            [
                'code' => 'fotografia_digital',
                'name' => 'Fotografia digital',
                'instructions' => 'Foto tipo infantil, de frente y con fondo blanco.',
                'file_extension' => 'jpg',
                'sort_order' => 4,
            ],
        ])->map(fn (array $document) => RequiredDocument::updateOrCreate(['code' => $document['code']], $document));
    }

    private function createApplicants(AdmissionPeriod $period, User $aspirante): array
    {
        return [
            Applicant::updateOrCreate(['curp' => 'LORM060512MCMPRR02'], [
                'user_id' => $aspirante->id,
                'admission_period_id' => $period->id,
                'folio' => 'SEG-2026-0001',
                'curp' => 'LORM060512MCMPRR02',
                'full_name' => 'Mariana Lopez Ramirez',
                'email' => 'aspirante@utem.test',
                'phone' => '3142223344',
                'career_interest' => 'TSU en Tecnologias de la Informacion',
                'high_school' => 'CBTis 226',
                'average' => 8.9,
                'status' => 'registrado_siiutem',
            ]),
            Applicant::updateOrCreate(['curp' => 'CUSA060415MCMRLB05'], [
                'admission_period_id' => $period->id,
                'folio' => 'SEG-2026-0002',
                'curp' => 'CUSA060415MCMRLB05',
                'full_name' => 'Abigail De la Cruz Solano',
                'email' => 'abigail.solano@correo.com',
                'phone' => '3145552211',
                'career_interest' => 'TSU en Contabilidad',
                'high_school' => 'Prepa UDG 12',
                'average' => 9.3,
                'status' => 'documentos_cargados',
                'siiutem_registration_confirmed' => true,
                'computer_notice_acknowledged' => true,
            ]),
            Applicant::updateOrCreate(['curp' => 'GUGJ060211HCMRZN09'], [
                'admission_period_id' => $period->id,
                'folio' => 'SEG-2026-0003',
                'curp' => 'GUGJ060211HCMRZN09',
                'full_name' => 'Pedro Guerra Gonzalez',
                'email' => 'pedro.guerra@correo.com',
                'phone' => '3149876543',
                'career_interest' => 'TSU en Quimica Area Industrial',
                'high_school' => 'CBTis 156 Cihuatlan',
                'average' => 8.1,
                'status' => 'documentos_observados',
                'siiutem_registration_confirmed' => true,
                'computer_notice_acknowledged' => true,
            ]),
        ];
    }

    private function attachDocuments(Applicant $applicant, Collection $documents, string $status): void
    {
        foreach ($documents as $document) {
            $isPending = $status === TrackingCatalog::DOCUMENT_PENDING;
            $applicant->documents()->updateOrCreate(['required_document_id' => $document->id], [
                'required_document_id' => $document->id,
                'status' => $status,
                'file_name' => $isPending ? null : $document->code.'-'.$applicant->id.'.'.$document->file_extension,
                'observation' => $status === TrackingCatalog::DOCUMENT_OBSERVED ? 'Revisar legibilidad y que el archivo corresponda al requisito.' : null,
                'uploaded_at' => $isPending ? null : now(),
            ]);
        }
    }

    private function createPayments(array $applicants): void
    {
        $applicants[0]->payment()->updateOrCreate(['applicant_id' => $applicants[0]->id], [
            'reference' => 'ADM-0001',
            'red_numbers' => 'UTEM00001',
            'amount' => 630,
            'status' => TrackingCatalog::PAYMENT_PENDING,
        ]);

        $applicants[1]->payment()->updateOrCreate(['applicant_id' => $applicants[1]->id], [
            'reference' => 'ADM-0002',
            'red_numbers' => 'UTEM00002',
            'amount' => 630,
            'status' => TrackingCatalog::PAYMENT_UPLOADED,
            'file_name' => 'comprobante-pago-2.pdf',
            'uploaded_at' => now(),
        ]);

        $applicants[2]->payment()->updateOrCreate(['applicant_id' => $applicants[2]->id], [
            'reference' => 'ADM-0003',
            'red_numbers' => 'UTEM00003',
            'amount' => 630,
            'status' => TrackingCatalog::PAYMENT_OBSERVED,
            'file_name' => 'comprobante-pago-3.pdf',
            'observation' => 'No se aprecian los numeros rojos en el concepto de pago.',
            'uploaded_at' => now(),
        ]);
    }
}
