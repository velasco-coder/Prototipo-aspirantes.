<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TrackingController;
use App\Support\TrackingCatalog;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'home'])->name('home');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::middleware('role:'.TrackingCatalog::ROLE_APPLICANT)->group(function () {
        Route::get('/aspirante', [DashboardController::class, 'applicant'])->name('applicant.index');
        Route::post('/aspirante/aviso-computadora', [TrackingController::class, 'acknowledgeComputerNotice'])->name('applicant.computer-notice');
        Route::post('/aspirante/confirmar-registro', [TrackingController::class, 'confirmSiiutemRegistration'])->name('applicant.siiutem.confirm');
        Route::post('/aspirante/pago/subir', [TrackingController::class, 'uploadPayment'])->name('applicant.payment.upload');
        Route::post('/aspirante/documentos/{document}/subir', [TrackingController::class, 'uploadDocument'])->name('applicant.documents.upload');
    });

    Route::middleware('role:'.TrackingCatalog::ROLE_SCHOOL_SERVICES)->group(function () {
        Route::get('/escolares', [DashboardController::class, 'schoolServices'])->name('school-services.index');
        Route::post('/escolares/pagos/{payment}/validar', [TrackingController::class, 'validatePayment'])->name('school-services.payments.validate');
        Route::post('/escolares/pagos/{payment}/observar', [TrackingController::class, 'observePayment'])->name('school-services.payments.observe');
        Route::post('/escolares/documentos/{document}/prevalidar', [TrackingController::class, 'prevalidateDocument'])->name('school-services.documents.prevalidate');
        Route::post('/escolares/documentos/{document}/validar', [TrackingController::class, 'validateDocument'])->name('school-services.documents.validate');
        Route::post('/escolares/documentos/{document}/observar', [TrackingController::class, 'observeDocument'])->name('school-services.documents.observe');
        Route::post('/escolares/aspirantes/{applicant}/enviar-indicaciones', [TrackingController::class, 'sendCenevalInstructions'])->name('school-services.instructions.send');
    });
});
