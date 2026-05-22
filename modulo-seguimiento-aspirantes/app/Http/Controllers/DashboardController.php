<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Support\TrackingCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function home(Request $request): RedirectResponse
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        return redirect()->route(TrackingCatalog::homeRouteForRole($request->user()->role));
    }

    public function applicant(Request $request): View
    {
        $applicant = $request->user()
            ->applicant()
            ->with(['admissionPeriod', 'payment', 'documents.requiredDocument', 'emailLogs'])
            ->firstOrFail();

        return view('dashboard.applicant', [
            'applicant' => $applicant,
            'labels' => $this->labels(),
            'links' => TrackingCatalog::officialLinks(),
        ]);
    }

    public function schoolServices(Request $request): View
    {
        $search = trim((string) $request->query('buscar'));

        $applicants = Applicant::with(['payment', 'documents.requiredDocument'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested
                        ->where('full_name', 'ilike', "%{$search}%")
                        ->orWhere('curp', 'ilike', "%{$search}%")
                        ->orWhere('email', 'ilike', "%{$search}%")
                        ->orWhere('folio', 'ilike', "%{$search}%");
                });
            })
            ->orderBy('id')
            ->get();

        return view('dashboard.school-services', [
            'applicants' => $applicants,
            'search' => $search,
            'labels' => $this->labels(),
            'links' => TrackingCatalog::officialLinks(),
        ]);
    }

    private function labels(): array
    {
        return [
            'roles' => TrackingCatalog::roleLabels(),
            'statuses' => TrackingCatalog::statusLabels(),
            'payments' => TrackingCatalog::paymentLabels(),
            'documents' => TrackingCatalog::documentLabels(),
        ];
    }
}
