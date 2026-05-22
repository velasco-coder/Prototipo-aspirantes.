<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('starts_on')->nullable();
            $table->date('ends_on')->nullable();
            $table->decimal('admission_fee', 10, 2)->default(630);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('required_documents', function (Blueprint $table) {
            $table->id();
            $table->string('code', 60)->unique();
            $table->string('name');
            $table->text('instructions')->nullable();
            $table->string('file_extension', 10)->default('pdf');
            $table->boolean('is_required')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('required_documents');
        Schema::dropIfExists('admission_periods');
    }
};
