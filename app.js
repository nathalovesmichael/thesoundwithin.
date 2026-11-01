/* THE SOUND WITHIN — script bersama untuk semua halaman.
   Isi: navbar, footer, gate nama, login Google, progress tracker, sertifikat, pengingat, reset. */

/* ═══ Kerangka halaman: gate, navbar, footer (diubah di sini = berubah di semua halaman) ═══ */
(function () {
    const GATE = `    <div class="name-gate" id="nameGate" hidden role="dialog" aria-modal="true" aria-labelledby="nameGateTitle">
        <form class="name-gate-panel" id="nameGateForm">
            <p class="name-gate-kicker">THE SOUND WITHIN</p>
            <h2 id="nameGateTitle">Sebelum kita mulai...</h2>
            <p>Kenalan dulu, siapa nama kamu?</p>
            <label for="visitorName" style="display:block;text-align:left;font-size:12px;margin-bottom:7px;color:var(--gray)">Nama kamu</label>
            <input id="visitorName" name="visitorName" type="text" placeholder="Masukkan nama kamu" autocomplete="given-name" maxlength="60" required autofocus>
            <label for="visitorDate" style="display:block;text-align:left;font-size:12px;margin:14px 0 7px;color:var(--gray)">Tanggal</label>
            <input id="visitorDate" name="visitorDate" type="date" required>
            <button type="submit">MASUK KE WEBSITE ↗</button>
            <div class="name-gate-error" id="nameGateError" aria-live="polite"></div>
            <div class="name-gate-or">ATAU</div>
            <div class="gsi-slot" id="gsiGateBtn"></div>
            <div class="gsi-note" id="gsiGateNote">Masuk dengan Google untuk mengaktifkan notifikasi &amp; pengingat belajar.</div>
        </form>
    </div>`;
    const HEADER = `    <header class="topbar">
        <div class="account-strip" id="navAccount" hidden>
            <div class="container account-strip-inner">
                <span id="navAvatarSlot"></span>
                <span class="nav-account-name" id="navName"></span>
                <button class="nav-logout" id="navLogout" type="button">Keluar</button>
            </div>
        </div>
        <div class="container navbar">
            <a class="brand" href="index.html" aria-label="The Sound Within halaman utama">
                <div class="brand-logo-frame">
                    <img src="logo.png" alt="Logo The Sound Within">
                </div>
                <span class="brand-name">THE SOUND WITHIN<small>THE ART OF UNDERSTANDING MUSIC</small></span>
            </a>
            <nav class="nav-links" id="navLinks">
                <a href="index.html">Home</a>
                <a href="family-chord.html">Family Chord</a>
                <a href="progress.html">Track Progress</a>
                <a href="progress.html#certificate">Sertifikat</a>
                <a href="tentang.html">Tentang Kami</a>
                <a href="tentang.html#profiles">Our Profiles</a>
                <a href="reading.html#reading-material">Materi Musik</a>
                <a href="komunitas.html">Komunitas</a>
                <a href="komunitas.html#exclusive">Eksklusif</a>
            </nav>
            <a class="nav-button" href="index.html#menu">Mulai menjelajah ↗</a>
            <button class="menu-toggle" id="menuToggle" aria-label="Buka menu" aria-expanded="false">☰</button>
        </div>
    </header>`;
    const FOOTER = `    <footer>
        <div class="container footer-row">
            <a class="brand" href="index.html">
                <div class="brand-logo-frame">
                    <img src="logo.png" alt="Logo The Sound Within">
                </div>
                <span class="brand-name">THE SOUND WITHIN<small>THE ART OF UNDERSTANDING MUSIC</small></span>
            </a>
            <div class="footer-links">
                <a href="index.html">Home</a><a href="progress.html#certificate">Sertifikat</a><a href="tentang.html">Tentang Kami</a><a href="komunitas.html">Komunitas</a><a href="komunitas.html#exclusive">Eksklusif</a>
            </div>
            <span>© <span id="year"></span> The Sound Within — Nadine Nathania (Universitas Indonesia)</span>
        </div>
    </footer>`;
    const put = function (id, html) { const el = document.getElementById(id); if (el) el.outerHTML = html; };
    put('site-gate', GATE);
    put('site-header', HEADER);
    put('site-footer', FOOTER);
})();

/* ═══ Menu mobile & tahun footer ═══ */
(function () {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.getElementById("navLinks");

        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });

        document.getElementById("year").textContent = new Date().getFullYear();
    })();

/* ═══ Progress tracker ═══ */
        (function () {
            const storageKey = 'theSoundWithinProgressV1';
            let progress = { reading: false, listening: false, speaking: false };
            try {
                const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
                progress = { ...progress, ...saved };
            } catch (error) {}

            function renderProgress() {
                const items = ['reading', 'listening', 'speaking'];
                const completed = items.filter(key => progress[key]).length;
                const percent = Math.round(completed / items.length * 100);
                const count = document.getElementById('progress-count');
                const percentLabel = document.getElementById('progress-percent');
                const fill = document.getElementById('progress-fill');
                const bar = document.getElementById('progress-bar');
                if (!count || !percentLabel || !fill || !bar) return;
                count.textContent = completed + ' dari 3 ruang selesai';
                percentLabel.textContent = percent + '%';
                fill.style.width = percent + '%';
                bar.setAttribute('aria-valuenow', String(percent));
                items.forEach(key => {
                    const card = document.getElementById('progress-' + key);
                    const state = document.getElementById('progress-' + key + '-state');
                    const button = card && card.querySelector('[data-progress="' + key + '"]');
                    if (!card || !state || !button) return;
                    card.classList.toggle('completed', Boolean(progress[key]));
                    state.textContent = progress[key] ? '✓ Selesai' : 'Belum selesai';
                    button.textContent = progress[key] ? 'Batalkan tanda selesai' : 'Tandai selesai';
                });
            }

            window.trackSoundProgress = function (key) {
                if (!Object.prototype.hasOwnProperty.call(progress, key)) return;
                progress[key] = true;
                try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (error) {}
                renderProgress();
            };

            document.querySelectorAll('[data-progress]').forEach(button => {
                button.addEventListener('click', function () {
                    const key = button.getAttribute('data-progress');
                    progress[key] = !progress[key];
                    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (error) {}
                    renderProgress();
                });
            });
            renderProgress();
        })();
    

/* ═══ Sertifikat ═══ */
window.downloadSoundWithinCertificate = function () {
            const esc = value => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
            let identity={name:'Peserta The Sound Within',date:new Date().toISOString().slice(0,10)};
            try { identity={...identity,...JSON.parse(localStorage.getItem('tsw_visitor_identity')||'{}')}; } catch(e) {}
            let reading=null,listening=null,speaking=null;
            try { reading=JSON.parse(localStorage.getItem('tsw_score_reading')||'null'); } catch(e) {}
            try { listening=JSON.parse(localStorage.getItem('tsw_score_listening')||'null'); } catch(e) {}
            try { speaking=JSON.parse(localStorage.getItem('tsw_score_speaking')||'null'); } catch(e) {}
            const readPct=reading?(reading.percent+'% · '+reading.score+' points'):'Belum dikerjakan';
            const listenPct=listening?(listening.accuracy+'% · '+listening.score+' points'):'Belum dikerjakan';
            let speakPct='Belum dikerjakan', speakBand=0;
            if(speaking){speakPct=(speaking.accuracy||'0%')+' · '+(speaking.score||'');const m=String(speaking.band||'').match(/([0-9]+(?:\.[0-9]+)?)/);speakBand=m?Number(m[1])/9*100:0;}
            const components=[reading?Number(reading.percent)||0:0,listening?Number(listening.accuracy)||0:speaking?0:0,speaking?speakBand:0];
            const overall=components.reduce((a,b)=>a+b,0)/3;
            const overallBand=(overall/100*9).toFixed(1);
            const dateObj=new Date((identity.date||new Date().toISOString().slice(0,10))+'T12:00:00');
            const niceDate=isNaN(dateObj)?identity.date:dateObj.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
            const serif = "Georgia,'Palatino Linotype','Book Antiqua','Times New Roman',serif";
            const nameSize = String(identity.name||'').length > 26 ? 52 : 70;
            const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12203F"/><stop offset=".55" stop-color="#1C2B4D"/><stop offset="1" stop-color="#27396A"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a97f34"/><stop offset=".5" stop-color="#f6e2a6"/><stop offset="1" stop-color="#a97f34"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#ffffff" stop-opacity=".10"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1100" fill="#f6f2e9"/>
<rect x="32" y="32" width="1536" height="1036" fill="url(#bg)"/>
<rect x="32" y="32" width="1536" height="1036" fill="url(#glow)"/>
<g stroke="#f6e2a6" stroke-opacity=".07" stroke-width="2"><line x1="120" y1="300" x2="1480" y2="300"/><line x1="120" y1="318" x2="1480" y2="318"/><line x1="120" y1="336" x2="1480" y2="336"/><line x1="120" y1="354" x2="1480" y2="354"/><line x1="120" y1="372" x2="1480" y2="372"/></g>
<rect x="54" y="54" width="1492" height="992" fill="none" stroke="url(#gold)" stroke-width="5"/>
<rect x="72" y="72" width="1456" height="956" fill="none" stroke="#f6e2a6" stroke-opacity=".45" stroke-width="1.5"/>
<g fill="none" stroke="url(#gold)" stroke-width="3"><path d="M90 170 V90 H170"/><path d="M1430 90 H1510 V170"/><path d="M90 930 V1010 H170"/><path d="M1430 1010 H1510 V930"/></g>
<g fill="#f6e2a6"><rect x="82" y="82" width="16" height="16" transform="rotate(45 90 90)"/><rect x="1502" y="82" width="16" height="16" transform="rotate(45 1510 90)"/><rect x="82" y="1002" width="16" height="16" transform="rotate(45 90 1010)"/><rect x="1502" y="1002" width="16" height="16" transform="rotate(45 1510 1010)"/></g>
<text x="800" y="150" text-anchor="middle" fill="#f6e2a6" font-family="${serif}" font-size="28" letter-spacing="12">THE SOUND WITHIN</text>
<path d="M560 182 H770 M830 182 H1040" stroke="url(#gold)" stroke-width="2"/>
<rect x="793" y="175" width="14" height="14" transform="rotate(45 800 182)" fill="#f6e2a6"/>
<text x="800" y="275" text-anchor="middle" fill="#ffffff" font-family="${serif}" font-size="84" letter-spacing="6">CERTIFICATE</text>
<text x="800" y="330" text-anchor="middle" fill="#f6e2a6" font-family="${serif}" font-size="26" letter-spacing="14">OF ACHIEVEMENT</text>
<text x="800" y="385" text-anchor="middle" fill="#c8cfe0" font-family="${serif}" font-size="21" font-style="italic" letter-spacing="3">Harmonic Fluency Test</text>
<text x="800" y="445" text-anchor="middle" fill="#d6dbea" font-family="${serif}" font-size="24" font-style="italic">This certificate is proudly presented to</text>
<text x="800" y="530" text-anchor="middle" fill="#f6e2a6" font-family="${serif}" font-size="${nameSize}" font-style="italic">${esc(identity.name)}</text>
<path d="M300 560 H1300" stroke="url(#gold)" stroke-width="2"/>
<text x="800" y="605" text-anchor="middle" fill="#ffffff" font-family="${serif}" font-size="22" letter-spacing="1">for completing the musical fluency assessment</text>
<g font-family="${serif}">
<rect x="150" y="645" width="390" height="140" rx="6" fill="#16223F" fill-opacity=".85" stroke="url(#gold)" stroke-width="2"/>
<rect x="605" y="645" width="390" height="140" rx="6" fill="#16223F" fill-opacity=".85" stroke="url(#gold)" stroke-width="2"/>
<rect x="1060" y="645" width="390" height="140" rx="6" fill="#16223F" fill-opacity=".85" stroke="url(#gold)" stroke-width="2"/>
<text x="345" y="690" text-anchor="middle" fill="#f6e2a6" font-size="22" letter-spacing="6">READING</text>
<text x="800" y="690" text-anchor="middle" fill="#f6e2a6" font-size="22" letter-spacing="6">LISTENING</text>
<text x="1255" y="690" text-anchor="middle" fill="#f6e2a6" font-size="22" letter-spacing="6">SPEAKING</text>
<path d="M285 708 H405 M740 708 H860 M1195 708 H1315" stroke="#f6e2a6" stroke-opacity=".5" stroke-width="1"/>
<text x="345" y="754" text-anchor="middle" fill="#ffffff" font-size="24">${esc(readPct)}</text>
<text x="800" y="754" text-anchor="middle" fill="#ffffff" font-size="24">${esc(listenPct)}</text>
<text x="1255" y="754" text-anchor="middle" fill="#ffffff" font-size="22">${esc(speakPct)}</text>
</g>
<text x="800" y="840" text-anchor="middle" fill="#c8cfe0" font-family="${serif}" font-size="22" letter-spacing="8">OVERALL BAND SCORE</text>
<text x="800" y="920" text-anchor="middle" fill="#f6e2a6" font-family="${serif}" font-size="70">${overallBand} <tspan font-size="36" fill="#c8cfe0">/ 9.0</tspan></text>
<text x="800" y="985" text-anchor="middle" fill="#c8cfe0" font-family="${serif}" font-size="22" font-style="italic">${esc(niceDate)}</text>
<g>
<circle cx="285" cy="925" r="78" fill="none" stroke="url(#gold)" stroke-width="4"/>
<circle cx="285" cy="925" r="66" fill="#16223F" stroke="#f6e2a6" stroke-opacity=".6" stroke-width="1.5"/>
<circle cx="285" cy="925" r="56" fill="none" stroke="#f6e2a6" stroke-opacity=".35" stroke-width="1" stroke-dasharray="3 5"/>
<text x="285" y="935" text-anchor="middle" fill="#f6e2a6" font-family="${serif}" font-size="34" letter-spacing="2">TSW</text>
<text x="285" y="958" text-anchor="middle" fill="#c8cfe0" font-family="${serif}" font-size="10" letter-spacing="3">OFFICIAL</text>
<text x="285" y="900" text-anchor="middle" fill="#f6e2a6" font-family="${serif}" font-size="14" letter-spacing="3">AWARD</text>
</g>
<g>
<path d="M1160 955 H1440" stroke="url(#gold)" stroke-width="2"/>
<text x="1300" y="990" text-anchor="middle" fill="#ffffff" font-family="${serif}" font-size="22" font-style="italic">Nadine Nathania Edelweiss</text>
<text x="1300" y="1014" text-anchor="middle" fill="#c8cfe0" font-family="${serif}" font-size="14" letter-spacing="4">CEO · THE SOUND WITHIN</text>
</g>
</svg>`;
            const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const image = new Image();

            image.onload = async function () {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1600; canvas.height = 1100;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#f6f2e9';
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    URL.revokeObjectURL(svgUrl);

                    canvas.toBlob(async function (pngBlob) {
                        if (!pngBlob) return;
                        const fileName = 'sertifikat-the-sound-within.png';
                        const downloadUrl = URL.createObjectURL(pngBlob);
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = fileName;
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setTimeout(() => URL.revokeObjectURL(downloadUrl), 120000);
                    }, 'image/png');
                } catch (error) {
                    URL.revokeObjectURL(svgUrl);
                }
            };
            image.src = svgUrl;
        };
(function () {
    const b = document.getElementById('hft-certificateBtnAlways');
    if (b) b.addEventListener('click', function () { window.downloadSoundWithinCertificate(); });
})();

/* ═══ Gate nama, login Google, pencatat pengunjung, pengingat, reset, akun di menu ═══ */
(function () {
    /* ▼▼ OAuth Client ID (tipe "Web application") dari Google Cloud Console ▼▼ */
    const GOOGLE_CLIENT_ID = '771722267994-pholvr21h15m7s9mri75e3mhvc4fpq74.apps.googleusercontent.com';
    /* ▼▼ URL Web App Google Apps Script (berakhiran /exec) untuk mencatat nama & email pengunjung ke Google Sheets ▼▼ */
    const LOG_URL = 'https://script.google.com/macros/s/AKfycby2G4MfA41n7cK_Hbp1CvhVv8hPuGkUEIbd3Gtg2jP1YAopebUWyWBAeRO2IHIRYoczMQ/exec';

    const ACC_KEY = 'tsw_account', REM_KEY = 'tsw_reminder', ID_KEY = 'tsw_visitor_identity', PROG_KEY = 'theSoundWithinProgressV1', GATE_KEY = 'tsw_gate_ok';
    const hasClientId = GOOGLE_CLIENT_ID.indexOf('ISI_') !== 0;
    const $ = id => document.getElementById(id);
    const gate = $('nameGate');
    const form = $('nameGateForm');
    const input = $('visitorName');
    const dateInput = $('visitorDate');
    const error = $('nameGateError');
    const greeting = document.querySelector('#home .eyebrow');

    let account = null, ident = null, passed = false;
    try { account = JSON.parse(localStorage.getItem(ACC_KEY) || 'null'); } catch (e) {}
    try { ident = JSON.parse(localStorage.getItem(ID_KEY) || 'null'); } catch (e) {}
    try { passed = sessionStorage.getItem(GATE_KEY) === '1'; } catch (e) {}

    function today() { const n = new Date(); return new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
    function nowHM() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
    function firstName() { return account && account.name ? account.name.split(' ')[0] : ''; }
    dateInput.value = today();

    /* ── Pencatat pengunjung ── */
    function logVisitor(type, name, email) {
        if (!LOG_URL) return;
        try {
            fetch(LOG_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ type: type, name: name || '', email: email || '', page: location.href, ua: navigator.userAgent }) });
        } catch (e) {}
    }
    function logOnce(type, name, email) {
        const id = email || name || '';
        try { if (sessionStorage.getItem('tsw_logged') === id) return; sessionStorage.setItem('tsw_logged', id); } catch (e) {}
        logVisitor(type, name, email);
    }

    /* ── Gate ── */
    function setGreeting(name) { if (greeting && name) greeting.textContent = 'SELAMAT DATANG, ' + name.toLocaleUpperCase('id-ID'); }
    function openGate() { gate.hidden = false; document.body.classList.add('name-gate-open'); try { input.focus(); } catch (e) {} }
    function closeGate() { gate.hidden = true; document.body.classList.remove('name-gate-open'); }
    function passGate() { try { sessionStorage.setItem(GATE_KEY, '1'); } catch (e) {} }

    /* ── Akun di menu ── */
    let who = null;
    function renderNav() {
        const box = $('navAccount');
        if (!box) return;
        if (!who || !who.name) { box.hidden = true; return; }
        box.hidden = false;
        const slot = $('navAvatarSlot');
        slot.innerHTML = '';
        if (who.picture) {
            const img = document.createElement('img');
            img.className = 'nav-avatar'; img.alt = ''; img.referrerPolicy = 'no-referrer'; img.src = who.picture;
            img.onerror = function () { slot.innerHTML = ''; slot.appendChild(initial()); };
            slot.appendChild(img);
        } else {
            slot.appendChild(initial());
        }
        function initial() {
            const s = document.createElement('span');
            s.className = 'nav-avatar-initial';
            s.textContent = (who.name.trim().charAt(0) || '?').toLocaleUpperCase('id-ID');
            return s;
        }
        $('navName').textContent = who.name.trim();
        box.title = who.name + (who.email ? ' · ' + who.email : '');
    }

    function signOut() {
        try { if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect(); } catch (e) {}
        try {
            localStorage.removeItem(ACC_KEY);
            localStorage.removeItem(ID_KEY);
            sessionStorage.removeItem(GATE_KEY);
            sessionStorage.removeItem('tsw_logged');
        } catch (e) {}
        location.reload();
    }

    /* ── Toast ── */
    let toastEl = null, toastTimer = null;
    function showToast(title, body) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'tsw-toast';
            toastEl.setAttribute('role', 'status');
            document.body.appendChild(toastEl);
        }
        toastEl.innerHTML = '';
        const x = document.createElement('button'); x.type = 'button'; x.className = 'tsw-toast-x'; x.textContent = '✕'; x.setAttribute('aria-label', 'Tutup');
        x.onclick = function () { toastEl.hidden = true; };
        const t = document.createElement('strong'); t.textContent = title;
        const p = document.createElement('p'); p.textContent = body;
        const a = document.createElement('a'); a.href = 'index.html#menu'; a.textContent = 'Mulai latihan ↗';
        a.onclick = function () { toastEl.hidden = true; };
        toastEl.appendChild(x); toastEl.appendChild(t); toastEl.appendChild(p); toastEl.appendChild(a);
        toastEl.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { if (toastEl) toastEl.hidden = true; }, 12000);
    }

    /* ── Gate: masuk dengan nama ── */
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = input.value.trim();
        const date = dateInput.value;
        if (!name) { error.textContent = 'Masukkan nama dulu ya.'; input.focus(); return; }
        if (!date) { error.textContent = 'Pilih tanggal dulu ya.'; dateInput.focus(); return; }
        try { localStorage.setItem(ID_KEY, JSON.stringify({ name: name, date: date })); } catch (e) {}
        ident = { name: name, date: date };
        passed = true; passGate();
        who = { name: name };
        logOnce('manual', name, '');
        setGreeting(name);
        closeGate();
        renderNav();
        const home = $('home'); if (home) home.scrollIntoView({ behavior: 'auto', block: 'start' });
    });

    /* ── Login Google ── */
    function decodeJwt(token) {
        const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(atob(b64).split('').map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''));
        return JSON.parse(json);
    }

    function handleCredential(resp) {
        try {
            const d = decodeJwt(resp.credential);
            account = { sub: d.sub, name: d.name || d.given_name || 'Pengguna', email: d.email || '', picture: d.picture || '' };
            try {
                localStorage.setItem(ACC_KEY, JSON.stringify(account));
                localStorage.setItem(ID_KEY, JSON.stringify({ name: account.name, date: today() }));
            } catch (e) {}
            passed = true; passGate();
            who = { name: account.name, email: account.email, picture: account.picture };
            setGreeting(account.name);
            closeGate();
            logOnce('google_login', account.name, account.email);
            renderNav();
            renderAccount();
            const home = $('home'); if (home) home.scrollIntoView({ behavior: 'auto', block: 'start' });
            showToast('Berhasil masuk', 'Halo, ' + firstName() + '! Pengingat belajar bisa kamu aktifkan di halaman Komunitas.');
        } catch (e) {
            showToast('Login gagal', 'Coba masuk dengan Google sekali lagi.');
        }
    }

    function initGoogle() {
        if (!hasClientId || !window.google || !google.accounts || !google.accounts.id) return;
        google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredential, auto_select: false });
        ['gsiGateBtn', 'gsiReminderBtn'].forEach(function (id) {
            const el = $(id);
            if (el) { el.innerHTML = ''; google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: 260, locale: 'id' }); }
        });
    }

    if (!hasClientId) {
        const msg = 'Login Google belum diaktifkan: isi GOOGLE_CLIENT_ID di bagian atas app.js.';
        if ($('gsiGateNote')) $('gsiGateNote').textContent = msg;
        if ($('gsiReminderNote')) $('gsiReminderNote').textContent = msg;
    }

    /* ── Pengingat belajar (kartu di halaman Komunitas) ── */
    function loadRem() {
        try {
            const r = JSON.parse(localStorage.getItem(REM_KEY) || 'null');
            if (r && account && r.sub === account.sub) return r;
        } catch (e) {}
        return { sub: account ? account.sub : null, enabled: false, time: '19:00', last: '' };
    }
    function saveRem(r) { try { localStorage.setItem(REM_KEY, JSON.stringify(r)); } catch (e) {} }

    function renderRem() {
        if (!account || !$('reminderTime')) return;
        const r = loadRem();
        $('reminderTime').value = r.time;
        const btn = $('reminderToggle');
        btn.textContent = r.enabled ? 'Matikan pengingat' : 'Aktifkan pengingat';
        btn.classList.toggle('on', r.enabled);
        btn.classList.toggle('primary', !r.enabled);
        const st = $('reminderStatus');
        if (!r.enabled) { st.textContent = 'Pengingat belum aktif. Pilih jam lalu tekan "Aktifkan pengingat".'; return; }
        const perm = ('Notification' in window) ? Notification.permission : 'unsupported';
        st.textContent = 'Pengingat aktif: setiap hari pukul ' + r.time + '. ' +
            (perm === 'granted' ? 'Notifikasi browser aktif. ' : 'Notifikasi browser belum diizinkan, jadi pengingat tampil sebagai pesan di halaman. ') +
            'Pengingat hanya berjalan selama tab website ini terbuka.';
    }

    function renderAccount() {
        const out = $('reminderLoggedOut'), inn = $('reminderLoggedIn');
        if (!out || !inn) return;
        if (account) {
            out.hidden = true; inn.hidden = false;
            $('reminderName').textContent = account.name;
            $('reminderEmail').textContent = account.email;
            const av = $('reminderAvatar');
            if (account.picture) { av.src = account.picture; av.style.display = ''; } else { av.removeAttribute('src'); av.style.display = 'none'; }
            renderRem();
        } else {
            out.hidden = false; inn.hidden = true;
        }
    }

    function progressDone() {
        try {
            const p = JSON.parse(localStorage.getItem(PROG_KEY) || '{}');
            return ['reading', 'listening', 'speaking'].filter(function (k) { return p[k]; }).length;
        } catch (e) { return 0; }
    }

    function notify(title, body) {
        showToast(title, body);
        if ('Notification' in window && Notification.permission === 'granted') {
            try { new Notification(title, { body: body, icon: 'logo.png', tag: 'tsw-reminder' }); } catch (e) {}
        }
    }

    function checkReminder() {
        if (!account) return;
        const r = loadRem();
        if (!r.enabled || r.last === today() || nowHM() < r.time) return;
        r.last = today(); saveRem(r);
        notify('Waktunya latihan musik 🎹', 'Hai ' + firstName() + '! Luangkan beberapa menit untuk latihan hari ini. Progres kamu: ' + progressDone() + ' dari 3 ruang selesai.');
    }

    async function askPermission() {
        if (!('Notification' in window)) return 'unsupported';
        let perm = Notification.permission;
        if (perm === 'default') { try { perm = await Notification.requestPermission(); } catch (e) {} }
        return perm;
    }

    if ($('reminderToggle')) {
        $('reminderToggle').addEventListener('click', async function () {
            if (!account) return;
            const r = loadRem();
            if (r.enabled) { r.enabled = false; saveRem(r); renderRem(); return; }
            r.time = $('reminderTime').value || '19:00';
            r.enabled = true;
            r.last = nowHM() >= r.time ? today() : '';
            r.sub = account.sub;
            saveRem(r);
            await askPermission();
            renderRem();
        });
        $('reminderTime').addEventListener('change', function () {
            if (!account) return;
            const r = loadRem();
            r.time = $('reminderTime').value || '19:00';
            r.last = nowHM() >= r.time ? today() : '';
            r.sub = account.sub;
            saveRem(r);
            renderRem();
        });
        $('reminderTest').addEventListener('click', async function () {
            await askPermission();
            notify('Tes notifikasi', 'Seperti ini pengingat belajar akan muncul. Semangat latihan, ' + (firstName() || 'kamu') + '!');
            renderRem();
        });
        $('accountSignOut').addEventListener('click', signOut);
    }
    if ($('navLogout')) $('navLogout').addEventListener('click', signOut);
    setInterval(checkReminder, 15000);

    /* ── Reset progress tracker & latihan (halaman Progress) ── */
    const resetMsg = $('resetMsg');
    if ($('resetProgressBtn')) {
        $('resetProgressBtn').addEventListener('click', function () {
            if (!confirm('Reset progress tracker? Semua tanda "selesai" akan dihapus.')) return;
            document.querySelectorAll('.progress-item.completed [data-progress]').forEach(function (b) { b.click(); });
            if (resetMsg) resetMsg.textContent = 'Progress tracker sudah direset.';
        });
    }
    if ($('resetLatihanBtn')) {
        $('resetLatihanBtn').addEventListener('click', function () {
            if (!confirm('Reset latihan? Skor Reading, Listening, dan Speaking yang tersimpan (termasuk untuk sertifikat) akan dihapus dan halaman dimuat ulang.')) return;
            try {
                ['tsw_score_reading', 'tsw_score_listening', 'tsw_score_speaking', 'hft_seen_progressions', 'hft_test_results'].forEach(function (k) { localStorage.removeItem(k); });
            } catch (e) {}
            location.reload();
        });
    }

    /* ── Status awal: lewati gate bila sudah login / sudah isi nama di sesi ini ── */
    if (account) {
        try { localStorage.setItem(ID_KEY, JSON.stringify({ name: account.name, date: today() })); } catch (e) {}
        who = { name: account.name, email: account.email, picture: account.picture };
        setGreeting(account.name);
        logOnce('google_return', account.name, account.email);
    } else if (passed && ident && ident.name) {
        who = { name: ident.name };
        setGreeting(ident.name);
    } else {
        openGate();
    }

    renderNav();
    renderAccount();
    checkReminder();

    if (!account && hasClientId) {
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true; s.defer = true;
        s.onload = initGoogle;
        document.head.appendChild(s);
    }
})();
