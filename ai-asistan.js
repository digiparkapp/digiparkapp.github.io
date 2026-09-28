// DigiPark AI Asistan — EK ÜCRETLİ hizmetin tanıtım bileşeni (tek kaynak).
// Hem tanıtım sitesinde (digiparkapp.github.io, /ai-asistan.js) hem web demoda
// (build-demo.mjs gömer) aynı görünüm ve metinle kullanılır.
//
// Tamamen senaryolu: ağ isteği, anahtar ya da tarayıcı depolaması YOK. Sayfadaki
// her [data-dp-ai-asistan] öğesine içeriği çizer. Renkler --ai-* değişkenleriyle
// gelir; koyu tema gibi uyarlamaları sayfanın kendisi yapar.
(function () {
  var WA_URL = 'https://wa.me/905075383119?text=DigiPark%20AI%20Asistan%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum';
  var ICON_PATHS =
    '<path d="M14 24 h52 a12 12 0 0 1 12 12 v28 a12 12 0 0 1 -12 12 h-28 l-15 13 v-13 h-9 a12 12 0 0 1 -12 -12 v-28 a12 12 0 0 1 12 -12z" fill="url(#asistanGrad)"/>' +
    '<circle cx="28" cy="50" r="5.5" fill="#fff"/><circle cx="42" cy="50" r="5.5" fill="#fff"/><circle cx="56" cy="50" r="5.5" fill="#fff"/>' +
    '<rect x="68" y="12" width="15" height="15" rx="3.5" fill="#4caf50"/><rect x="84" y="4" width="11" height="11" rx="2.6" fill="#21a0b0"/>' +
    '<rect x="85" y="20" width="10" height="10" rx="2.4" fill="#f4b23c"/>';
  var GRAD_DEFS = '<defs><linearGradient id="asistanGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1565c0"/><stop offset="1" stop-color="#21a0b0"/></linearGradient></defs>';
  // Gradient tanımı sayfada yalnızca bir kez yer alır; diğer ikonlar aynı id'ye başvurur
  function icon(cls, withDefs) {
    return '<svg class="' + cls + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">' + (withDefs ? GRAD_DEFS : '') + ICON_PATHS + '</svg>';
  }
  var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.52 3.62 1.42 5.13L2 22l5.13-1.35c1.44.79 3.09 1.24 4.85 1.24h.01c5.46 0 9.91-4.45 9.91-9.91C21.9 6.45 17.5 2 12.04 2zm5.79 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.37-.15-.2-1.18-1.57-1.18-2.99 0-1.42.75-2.11 1.02-2.4.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13 1.01 2.08 1.32 2.39 1.47.31.15.49.13.67-.05.18-.18.77-.9.98-1.21.2-.31.41-.26.68-.16.28.1 1.75.83 2.05.98.3.15.5.23.57.35.08.13.08.73-.16 1.41z"/></svg>';

  var GREETING = 'Merhaba! Ben Pamuk 🎈 Örnek Oyun Parkı hakkında merak ettiklerinizi sorabilirsiniz.';
  var QA = [
    { q: 'Fiyatlarınız nedir?', a: 'İlk 1 saat 250 ₺, sonraki her 30 dakika 100 ₺. Kardeş girişlerinde %10 indirim var 😊' },
    { q: 'Hafta sonu kaçta açıksınız?', a: 'Cumartesi ve pazar 10:00–21:00 arası açığız.' },
    { q: 'Doğum günü yapıyor musunuz?', a: 'Evet! 15 çocuğa kadar paketlerimiz var. Tarih ayırmak için sizi yetkilimize bağlayayım mı?', wa: true },
    { q: 'Çorap getirmeli miyim?', a: 'Evet, oyun alanında kaymaz çorap zorunlu. Unutursanız girişte satın alabilirsiniz.' },
    { q: 'Atölye var mı?', a: 'Hafta içi 4–6 yaş resim atölyemiz ve 7–10 yaş robotik sınıfımız var. Kontenjan dolmadan kayıt öneririm.' }
  ];
  var CHANNELS = [
    ['🔗', 'Parkınıza özel link', 'Instagram profilinize ve Google Haritalar kaydınıza eklenir'],
    ['📱', 'QR kod afişi', 'Giriş ve masalara; afişi biz hazırlıyoruz'],
    ['💬', 'Web sitenizde sohbet balonu', 'Siteniz varsa tek satırla eklenir'],
    ['⭐', 'WhatsApp & Instagram DM', 'Üst pakette (ayrıca görüşülür)']
  ];
  var VALUES = [
    'Gece, hafta sonu, yoğun saat fark etmez; hiçbir soru cevapsız kalmaz',
    'Adını, rengini, karşılama mesajını siz belirlersiniz',
    'Cevaplayamadığı konuda veliyi WhatsApp\'ınıza yönlendirir',
    'Çocuk ve veli kişisel verileri asistana gönderilmez (KVKK uyumlu yaklaşım)'
  ];

  var CSS = [
    '.dp-ai{--ai-blue:#1565c0;--ai-teal:#21a0b0;--ai-card:#fff;--ai-ink:#1c2b3a;--ai-soft:#5b6b7a;--ai-line:#dbe8ee;--ai-paper:#f3f8fb;',
    '  --ai-chat:#eef4f8;--ai-bot:#fff;container-type:inline-size;font-family:"Nunito",sans-serif;color:var(--ai-ink);line-height:1.55;text-align:left}',
    '.dp-ai *{box-sizing:border-box}',
    '.dp-ai-top{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:10px}',
    '.dp-ai-logo{width:64px;height:64px;flex-shrink:0;filter:drop-shadow(0 6px 12px rgba(21,101,192,.25))}',
    '.dp-ai-titles{flex:1 1 220px;min-width:0}',
    '.dp-ai-title{margin:0;font-family:"Nunito",sans-serif;font-weight:900;font-size:1.7rem;line-height:1.15;letter-spacing:-.01em;',
    '  background:linear-gradient(100deg,var(--ai-blue),var(--ai-teal));-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.dp-ai-badge{display:inline-flex;align-items:center;gap:4px;margin-top:6px;padding:5px 12px;border-radius:999px;font-weight:900;font-size:.74rem;',
    '  letter-spacing:.03em;color:#fff;background:linear-gradient(100deg,#f4a52c,#e8743a);box-shadow:0 4px 12px -4px rgba(232,116,58,.6);white-space:nowrap}',
    '.dp-ai-slogan{margin:4px 0 6px;font-weight:800;font-size:1.12rem;color:var(--ai-ink)}',
    '.dp-ai-lead{margin:0 0 22px;color:var(--ai-soft);font-size:.95rem;max-width:720px}',
    '.dp-ai-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:26px;align-items:start}',
    '@container (min-width:760px){.dp-ai-grid{grid-template-columns:minmax(0,360px) minmax(0,1fr);gap:36px}}',
    /* telefon */
    '.dp-ai-phone{width:100%;max-width:360px;margin:0 auto;border:9px solid #1c2b3a;border-radius:34px;background:var(--ai-chat);overflow:hidden;',
    '  box-shadow:0 24px 48px -20px rgba(21,101,192,.45);position:relative}',
    '.dp-ai-phone::before{content:"";position:absolute;top:0;left:50%;width:34%;height:16px;margin-left:-17%;background:#1c2b3a;border-radius:0 0 12px 12px;z-index:2}',
    '.dp-ai-bar{display:flex;align-items:center;gap:10px;padding:24px 14px 11px;background:linear-gradient(100deg,var(--ai-blue),var(--ai-teal));color:#fff}',
    '.dp-ai-bar .dp-ai-av{width:34px;height:34px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '.dp-ai-bar .dp-ai-av svg{width:25px;height:25px}',
    '.dp-ai-bar b{display:block;font-size:.9rem;line-height:1.2}',
    '.dp-ai-bar small{display:flex;align-items:center;gap:5px;font-size:.72rem;opacity:.92;font-weight:700}',
    '.dp-ai-online{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 2px rgba(255,255,255,.35)}',
    '.dp-ai-log{height:330px;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth}',
    '.dp-ai-msg{max-width:86%;padding:8px 12px;border-radius:16px;font-size:.86rem;line-height:1.45;overflow-wrap:anywhere;animation:dpAiIn .28s ease-out both}',
    '.dp-ai-msg.me{align-self:flex-end;background:var(--ai-blue);color:#fff;border-bottom-right-radius:5px}',
    '.dp-ai-row{display:flex;align-items:flex-end;gap:7px;max-width:92%;animation:dpAiIn .28s ease-out both}',
    '.dp-ai-row>svg{width:26px;height:26px;flex-shrink:0}',
    '.dp-ai-row .dp-ai-msg{max-width:none;background:var(--ai-bot);color:#1c2b3a;border:1px solid #dde8ee;border-bottom-left-radius:5px;animation:none}',
    '.dp-ai-fakewa{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:6px 11px;border-radius:999px;background:#25D366;color:#fff;',
    '  font-weight:800;font-size:.74rem;cursor:default;user-select:none}',
    '.dp-ai-typing{display:inline-flex;gap:4px;padding:11px 13px}',
    '.dp-ai-typing i{width:7px;height:7px;border-radius:50%;background:#90a4ae;animation:dpAiDot 1s infinite ease-in-out}',
    '.dp-ai-typing i:nth-child(2){animation-delay:.15s}.dp-ai-typing i:nth-child(3){animation-delay:.3s}',
    '.dp-ai-typing em{font-style:normal;font-size:.72rem;color:#78909c;margin-left:4px;font-weight:700}',
    '.dp-ai-chips{display:flex;flex-wrap:wrap;gap:6px;padding:10px 10px 12px;background:#fff;border-top:1px solid #dde8ee}',
    '.dp-ai-chip{font:inherit;font-size:.76rem;font-weight:800;padding:7px 11px;border-radius:999px;border:1.5px solid var(--ai-teal);',
    '  background:rgba(33,160,176,.08);color:#16707c;cursor:pointer;transition:transform .15s,background .15s}',
    '.dp-ai-chip:hover:not(:disabled){background:rgba(33,160,176,.18);transform:translateY(-1px)}',
    '.dp-ai-chip:disabled{cursor:default;opacity:.45;border-color:#cfd8dc;background:#f1f4f6;color:#78909c;text-decoration:line-through}',
    '.dp-ai-chip.busy:disabled{text-decoration:none}',
    '.dp-ai-reset{display:block;width:100%;font:inherit;font-size:.78rem;font-weight:800;padding:9px;border:0;border-top:1px solid #dde8ee;background:#fff;',
    '  color:var(--ai-blue);cursor:pointer}',
    '.dp-ai-reset:hover{background:#f3f8fb}',
    '.dp-ai-note{max-width:360px;margin:10px auto 0;text-align:center;font-size:.76rem;color:var(--ai-soft);opacity:.85}',
    /* sağ sütun */
    '.dp-ai-h{margin:0 0 12px;font-family:"Nunito",sans-serif;font-weight:900;font-size:1.08rem;color:var(--ai-ink)}',
    '.dp-ai-channels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:24px}',
    '@container (max-width:420px){.dp-ai-channels{grid-template-columns:minmax(0,1fr)}}',
    '.dp-ai-ch{background:var(--ai-card);border:1px solid var(--ai-line);border-radius:14px;padding:12px 13px;display:flex;gap:10px;align-items:flex-start;min-width:0}',
    '.dp-ai-ch .ic{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;',
    '  background:linear-gradient(135deg,rgba(21,101,192,.12),rgba(33,160,176,.16))}',
    '.dp-ai-ch b{display:block;font-size:.86rem;line-height:1.3;color:var(--ai-ink)}',
    '.dp-ai-ch span{display:block;font-size:.76rem;color:var(--ai-soft);line-height:1.4;margin-top:2px}',
    '.dp-ai-values{list-style:none;margin:0 0 24px;padding:0;display:flex;flex-direction:column;gap:9px}',
    '.dp-ai-values li{display:flex;gap:10px;align-items:flex-start;font-size:.9rem;color:var(--ai-ink);font-weight:700;line-height:1.45}',
    '.dp-ai-values li::before{content:"✓";flex-shrink:0;width:22px;height:22px;border-radius:50%;background:#4caf50;color:#fff;font-size:.78rem;font-weight:900;',
    '  display:flex;align-items:center;justify-content:center;margin-top:1px}',
    '.dp-ai-close{background:linear-gradient(100deg,var(--ai-blue),var(--ai-teal));border-radius:16px;padding:18px 18px;color:#fff;',
    '  display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}',
    '.dp-ai-close p{margin:0;font-weight:800;font-size:.94rem;flex:1 1 220px;min-width:0}',
    '.dp-ai-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff !important;text-decoration:none;font-weight:900;',
    '  font-size:.88rem;padding:11px 20px;border-radius:999px;box-shadow:0 8px 18px -8px rgba(0,0,0,.45);transition:transform .15s;white-space:nowrap}',
    '.dp-ai-cta:hover{transform:translateY(-1px)}',
    '.dp-ai-cta svg{width:19px;height:19px}',
    '@container (max-width:420px){.dp-ai-title{font-size:1.4rem}.dp-ai-logo{width:56px;height:56px}.dp-ai-cta{width:100%}}',
    '@keyframes dpAiIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '@keyframes dpAiDot{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-4px);opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.dp-ai-msg,.dp-ai-row,.dp-ai-typing i{animation:none}.dp-ai-log{scroll-behavior:auto}}'
  ].join('\n');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function markup(first) {
    return '' +
      '<div class="dp-ai-top">' + icon('dp-ai-logo', first) +
        '<div class="dp-ai-titles"><h2 class="dp-ai-title">DigiPark AI Asistan</h2>' +
        '<span class="dp-ai-badge">✨ EK HİZMET · Ayrı ücretlendirilir</span></div>' +
      '</div>' +
      '<p class="dp-ai-slogan">Veliler sorar, asistanınız 7/24 parkınızın adıyla cevaplar.</p>' +
      '<p class="dp-ai-lead">Fiyat, saat, doğum günü, atölye… Personeliniz aynı soruları tekrar tekrar cevaplamakla uğraşmasın. ' +
        'Asistan bilgileri DigiPark\'tan otomatik alır; fiyatınızı değiştirdiğinizde o da güncellenir.</p>' +
      '<div class="dp-ai-grid">' +
        '<div>' +
          '<div class="dp-ai-phone" aria-label="Örnek asistan sohbeti">' +
            '<div class="dp-ai-bar"><span class="dp-ai-av">' + icon('', false) + '</span>' +
              '<div><b>Pamuk · Örnek Oyun Parkı</b><small><span class="dp-ai-online"></span>çevrimiçi</small></div></div>' +
            '<div class="dp-ai-log" aria-live="polite"></div>' +
            '<div class="dp-ai-chips">' + QA.map(function (x, i) {
              return '<button type="button" class="dp-ai-chip" data-i="' + i + '">' + esc(x.q) + '</button>';
            }).join('') + '</div>' +
            '<button type="button" class="dp-ai-reset">↺ Baştan başlat</button>' +
          '</div>' +
          '<p class="dp-ai-note">Örnek görünümdür. Gerçek asistan parkınızın adı, renkleri ve bilgileriyle çalışır.</p>' +
        '</div>' +
        '<div>' +
          '<h3 class="dp-ai-h">Veliler asistana nereden ulaşır?</h3>' +
          '<div class="dp-ai-channels">' + CHANNELS.map(function (c) {
            return '<div class="dp-ai-ch"><span class="ic">' + c[0] + '</span><div><b>' + esc(c[1]) + '</b><span>' + esc(c[2]) + '</span></div></div>';
          }).join('') + '</div>' +
          '<h3 class="dp-ai-h">Neden değer?</h3>' +
          '<ul class="dp-ai-values">' + VALUES.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' +
          '<div class="dp-ai-close"><p>Sadece DigiPark kullanıcılarına özel ek hizmettir. Fiyat için görüşelim.</p>' +
            '<a class="dp-ai-cta" href="' + WA_URL + '" target="_blank" rel="noopener">' + WA_SVG + 'Asistan hakkında bilgi al</a></div>' +
        '</div>' +
      '</div>';
  }

  function mount(root, first) {
    root.classList.add('dp-ai');
    root.innerHTML = markup(first);
    var log = root.querySelector('.dp-ai-log');
    var chips = [].slice.call(root.querySelectorAll('.dp-ai-chip'));
    var asked = {};
    var timer = null;

    function scrollDown() { log.scrollTop = log.scrollHeight; }
    function bot(html) {
      var row = document.createElement('div');
      row.className = 'dp-ai-row';
      row.innerHTML = icon('', false) + '<div class="dp-ai-msg">' + html + '</div>';
      log.appendChild(row);
      scrollDown();
      return row;
    }
    function me(text) {
      var m = document.createElement('div');
      m.className = 'dp-ai-msg me';
      m.textContent = text;
      log.appendChild(m);
      scrollDown();
    }
    function setBusy(busy) {
      chips.forEach(function (c) {
        c.disabled = busy || !!asked[c.getAttribute('data-i')];
        c.classList.toggle('busy', busy && !asked[c.getAttribute('data-i')]);
      });
    }
    function reset() {
      clearTimeout(timer);
      timer = null;
      asked = {};
      log.innerHTML = '';
      bot(esc(GREETING));
      setBusy(false);
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var i = c.getAttribute('data-i');
        if (asked[i] || timer) return;
        asked[i] = true;
        var item = QA[i];
        me(item.q);
        setBusy(true);
        var typing = bot('<span class="dp-ai-typing"><i></i><i></i><i></i><em>yazıyor…</em></span>');
        typing.querySelector('.dp-ai-msg').style.padding = '0';
        timer = setTimeout(function () {
          timer = null;
          typing.remove();
          bot(esc(item.a) + (item.wa ? '<br><span class="dp-ai-fakewa" aria-disabled="true">💬 WhatsApp\'tan yetkiliyle görüş</span>' : ''));
          setBusy(false);
        }, 1000 + Math.round(Math.random() * 500));
      });
    });
    root.querySelector('.dp-ai-reset').addEventListener('click', reset);
    reset();
  }

  function init() {
    var roots = document.querySelectorAll('[data-dp-ai-asistan]');
    if (!roots.length) return;
    if (!document.getElementById('dp-ai-style')) {
      var st = document.createElement('style');
      st.id = 'dp-ai-style';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    [].forEach.call(roots, function (r, i) { if (!r.classList.contains('dp-ai')) mount(r, i === 0 && !document.getElementById('asistanGrad')); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
