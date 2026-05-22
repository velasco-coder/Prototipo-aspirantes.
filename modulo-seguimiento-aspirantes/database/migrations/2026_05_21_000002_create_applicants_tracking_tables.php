<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('admission_period_id')->constrained()->cascadeOnDelete();
            $table->string('folio')->unique();
            $table->string('curp', 18)->unique();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->string('career_interest')->nullable();
            $table->string('high_school')->nullable();
            $table->decimal('average', 4, 2)->nullable();
            $table->string('status')->default('registrado_siiutem')->index();
            $table->boolean('siiutem_registration_confirmed')->default(false);
            $table->boolean('computer_notice_acknowledged')->default(false);
            $table->timestamp('ceneval_instructions_sent_at')->nullable();
            $table->text('internal_notes')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('admission_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->nullable()->unique();
            $table->string('red_numbers')->nullable();
            $table->decimal('amount', 10, 2)->default(630);
            $table->string('status')->default('pendiente')->index();
            $table->string('file_name')->nullable();
            $table->text('observation')->nullable();
            $table->timestamp('uploaded_at')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('applicant_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('required_document_id')->constrained()->restrictOnDelete();
            $table->string('status')->default('pendiente')->index();
            $table->string('file_name')->nullable();
            $table->text('observation')->nullable();
            $table->timestamp('uploaded_at')->nullable();
            $table->timestamp('prevalidated_at')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();

            $table->unique(['applicant_id', 'required_document_id']);
        });

        Schema::create('guidance_email_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sent_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('recipient_email');
            $table->string('subject');
            $table->text('body');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guidance_email_logs');
        Schema::dropIfExists('applicant_documents');
        Schema::dropIfExists('admission_payments');
        Schema::dropIfExists('applicants');
    }
};
