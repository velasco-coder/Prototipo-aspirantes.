@extends('layouts.app')

@section('title', 'Iniciar sesion')

@section('content')
    <section class="panel login-card">
        <div class="grid two">
            <div>
                <h2>Modulo complementario de aspirantes</h2>
                <p class="muted">Este modulo no reemplaza SIIUTEM. Sirve para guiar al aspirante, controlar documentos y apoyar a Escolares antes de CENEVAL.</p>

                <form method="POST" action="{{ route('login.store') }}" class="grid">
                    @csrf
                    <div class="field">
                        <label for="email">Correo</label>
                        <input id="email" name="email" type="email" value="{{ old('email', 'aspirante@utem.test') }}" required autofocus>
                    </div>
                    <div class="field">
                        <label for="password">Contrasena</label>
                        <input id="password" name="password" type="password" value="Aspirante123" required>
                    </div>
                    <button class="button" type="submit">Entrar</button>
                </form>
            </div>

            <div>
                <h3>Credenciales de prueba</h3>
                <div class="grid">
                    <div class="credential">
                        <strong>Aspirante</strong><br>
                        aspirante@utem.test<br>
                        <span class="muted">Aspirante123</span>
                    </div>
                    <div class="credential">
                        <strong>Escolares</strong><br>
                        escolares@utem.test<br>
                        <span class="muted">Escolares123</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
