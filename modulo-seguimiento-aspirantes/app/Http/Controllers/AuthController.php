<?php

namespace App\Http\Controllers;

use App\Support\TrackingCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function showLogin(): View
    {
        return view('auth.login', [
            'roles' => TrackingCatalog::roleLabels(),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt([...$credentials, 'active' => true])) {
            return back()
                ->withErrors(['email' => 'Correo o contrasena incorrectos.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->route(TrackingCatalog::homeRouteForRole($request->user()->role));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
