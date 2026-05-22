<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Modulo Seguimiento Aspirantes')</title>
    <style>
        :root {
            --bg: #f5f7f9;
            --panel: #ffffff;
            --text: #172033;
            --muted: #667085;
            --line: #d9e2ec;
            --primary: #0f6b6d;
            --green: #1f7a45;
            --amber: #9a6700;
            --red: #b42318;
            --blue: #175cd3;
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: var(--bg); color: var(--text); }
        a { color: var(--primary); }
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 16px 24px;
            background: var(--panel);
            border-bottom: 1px solid var(--line);
        }
        .brand h1 { margin: 0; font-size: 22px; }
        .brand span, .muted { color: var(--muted); font-size: 14px; }
        .shell { max-width: 1240px; margin: 0 auto; padding: 24px; }
        .panel { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px; margin-bottom: 18px; }
        .grid { display: grid; gap: 16px; }
        .grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        h2, h3 { margin: 0 0 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
        th { color: var(--muted); font-size: 13px; }
        .table-wrap { overflow-x: auto; }
        .actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 36px;
            padding: 8px 12px;
            border: 0;
            border-radius: 6px;
            background: var(--primary);
            color: #fff;
            text-decoration: none;
            font-weight: 700;
            cursor: pointer;
        }
        .button.secondary { background: #e8eef3; color: var(--text); }
        .button.success { background: var(--green); }
        .button.danger { background: var(--red); }
        .button.small { min-height: 30px; padding: 6px 9px; font-size: 12px; }
        .button:disabled { opacity: .45; cursor: not-allowed; }
        .badge { display: inline-flex; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; background: #e8eefc; color: var(--blue); }
        .badge.green { background: #e7f6ec; color: var(--green); }
        .badge.amber { background: #fff4d8; color: var(--amber); }
        .badge.red { background: #fdecec; color: var(--red); }
        .notice { border-radius: 8px; padding: 12px; margin-bottom: 16px; border: 1px solid var(--line); }
        .notice.success { background: #edf9f0; border-color: #b7e4c7; }
        .notice.error { background: #fff0f0; border-color: #ffc9c9; }
        .notice.warning { background: #fff8e6; border-color: #f3d28c; }
        .field { display: grid; gap: 6px; }
        label { font-weight: 700; }
        input, textarea {
            width: 100%;
            border: 1px solid var(--line);
            border-radius: 6px;
            padding: 10px;
            font: inherit;
            background: #fff;
        }
        textarea { min-height: 70px; }
        .metric { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 14px; }
        .metric strong { display: block; font-size: 24px; }
        .doc-row { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--line); }
        .doc-row:last-child { border-bottom: 0; }
        .login-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
        .login-card { width: min(980px, 100%); }
        .credential { border: 1px solid var(--line); border-radius: 8px; padding: 12px; background: #fbfcfd; }
        @media (max-width: 820px) {
            .topbar, .grid.two, .grid.three { display: grid; grid-template-columns: 1fr; }
            .shell { padding: 14px; }
            .doc-row { display: grid; }
        }
    </style>
</head>
<body>
    @auth
        <header class="topbar">
            <div class="brand">
                <h1>Seguimiento de Aspirantes</h1>
                <span>{{ auth()->user()->name }} · {{ $labels['roles'][auth()->user()->role] ?? auth()->user()->role }}</span>
            </div>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button class="button secondary" type="submit">Cerrar sesion</button>
            </form>
        </header>
    @endauth

    <main class="@auth shell @else login-page @endauth">
        @if (session('success'))
            <div class="notice success">{{ session('success') }}</div>
        @endif
        @if (session('error'))
            <div class="notice error">{{ session('error') }}</div>
        @endif
        @if ($errors->any())
            <div class="notice error">
                <strong>Revisa la informacion:</strong>
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </main>
</body>
</html>
