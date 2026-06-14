# Sirius Terminal — Tema & Kabuk Rehberi

Sirius Canvas’ın görsel dili ve kabuk kuralları. Tüm renkler CSS değişkenleriyle yönetilir; bileşenler ortak class’ları paylaşır.

**Kaynak dosyalar**

| Dosya | Rol |
|-------|-----|
| `src/index.css` | Tema değişkenleri (`dark` / `light` / `sirius-i`) |
| `src/App.css` | Bileşen stilleri + Sirius I override’ları |
| `src/themeStorage.ts` | Tema tercihi (`sirius-terminal-theme`) |
| `src/ThemeSelect.tsx` | Tema dropdown |
| `src/WidgetSelect.tsx` | Widget çoklu seçim dropdown |
| `src/panels.ts` | Widget kataloğu, min boyutlar, default layout |

**Tema seçimi:** Header → **Dark · Light · Sirius I**  
Kod id: `sirius-i` · Label: `Sirius I` · Eski `bloomberg` kaydı otomatik migrate edilir.

---

## Sirius I (birincil hedef)

Soft dark, neredeyse siyah zemin. Nötr gri UI; renkli vurgu yok — sadece bid/ask semantiği.

### Zemin & yapı

| Değişken | Hex | Kullanım |
|----------|-----|----------|
| `--bg` | `#0a0a0a` | Sayfa + header + panel gövdesi |
| `--header-border` | `transparent` | Header alt çizgi yok |
| `--panel-bg` | `#0a0a0a` | Panel gövdesi |
| `--panel-header-bg` | `transparent` | Başlık barı yok |
| `--panel-border` | `#2a2a2a` | İnce panel çerçevesi |
| `--shadow` | `transparent` | Gölge yok |
| `--grid-line` | `transparent` | Chart grid çizgisi yok |

### Yazı & veri

| Değişken | Hex | Kullanım |
|----------|-----|----------|
| `--text` | `#ffffff` | Ana metin |
| `--text-muted` | `#a3a3a3` | İkincil metin, dropdown |
| `--text-dim` | `#737373` | Hint, tablo başlık |
| `--bid` / `--up` / `--long` | `#77a898` | Alış / pozitif (sage) |
| `--ask` / `--down` / `--short` | `#9e8585` | Satış / negatif (dusty rose) |
| `--handle` | `#525252` | Resize tutamacı (nötr gri) |

### Sirius I stil kararları

`src/App.css` → `[data-theme='sirius-i']`

| Özellik | Değer |
|---------|-------|
| Border radius | `2px` |
| Header | Logo + **Sirius**, sıkışık padding, alt border yok |
| Dropdown | Ghost trigger, `#2a2a2a` border, menü gölgesiz |
| Panel başlık | Normal case, bar yok, kompakt padding |
| × kapatma | Sadece panel hover’da görünür |
| Sürükleme placeholder | Görünmez |
| Resize handle | Minimal, 8 yön, invisible |
| Panel body scrollbar | Gizli |
| Chart | Minimal gradient glow |

---

## Dark tema

Varsayılan fallback (`loadTheme` → `dark`). Klasik terminal — mavi UI vurgusu, belirgin panel border.

### Özet

| Rol | Değişken | Hex |
|-----|----------|-----|
| Arka plan | `--bg` | `#0b0e11` |
| Panel | `--panel-bg` | `#151b23` |
| Border | `--panel-border` | `#243044` |
| Yazı | `--text` | `#e6edf3` |
| Bid / Up | `--bid`, `--up` | `#3dd68c` |
| Ask / Down | `--ask`, `--down` | `#f85149` |
| Handle | `--handle` | `#60a5fa` |

Tam liste: `src/index.css` → `:root`, `[data-theme='dark']`.

---

## Light tema

| Rol | Değişken | Hex |
|-----|----------|-----|
| Arka plan | `--bg` | `#f3f4f6` |
| Panel | `--panel-bg` | `#ffffff` |
| Yazı | `--text` | `#111827` |
| Bid / Up | `--bid`, `--up` | `#16a34a` |
| Ask / Down | `--ask`, `--down` | `#dc2626` |
| Handle | `--handle` | `#2563eb` |

Tam liste: `src/index.css` → `[data-theme='light']`.

---

## Tipografi

- Font: `'SF Mono', ui-monospace, Menlo, Monaco, Consolas, monospace`
- Panel başlık (dark/light): `0.75rem`, uppercase
- Panel başlık (Sirius I): `0.75rem`, normal case
- Tablo / içerik: `0.75rem`, `font-variant-numeric: tabular-nums`

---

## Kabuk & grid (tema dışı ama bağlantılı)

| Konu | Değer |
|------|-------|
| Grid | `react-grid-layout` v2, 36/24/12 kolon, `rowHeight` 11px |
| Overlap | Açık — son sürüklenen/resize üstte (z-index) |
| Layout kayıt | `sirius-terminal-workspace` — sadece lg |
| Widget açılış boyutu | `minW` × `minH` (ideal = minimum) |
| Scroll | Sayfa scroll yok; canvas (`terminal-grid`) içinde |

Widget min boyutları (`panels.ts`):

| Widget | minW × minH (lg) |
|--------|------------------|
| Chart | 12 × 12 |
| Order Book | 9 × 9 |
| Positions | 6 × 6 |
| Watchlist | 6 × 6 |
| Recent Trades | 6 × 6 |
| Ticker | 3 × 3 |

---

## Yeni widget eklerken

1. Renk hardcode etme — `--bid`, `--ask`, `--text` vb. kullan
2. Ortak class: `.data-table`, `.watchlist`, `.ticker-grid`
3. Meta: `src/panels.ts` — `minW/minH` = ideal açılış boyutu
4. İçerik: `src/PanelContent.tsx` — yeni `case`
5. Tema değişikliği: önce `index.css`; Sirius I özel görünüm → `App.css` override

---

## Tasarım ilkeleri

- **Sirius I:** Sessiz, border-minimal, veri ön planda; yeşil/kırmızı sadece fiyat semantiği
- **Dark/Light:** Klasik terminal — panel kabuğu belirgin, mavi etkileşim rengi
- Panel başına renk şeridi yok — tüm widget’lar aynı kabuk
- CSS değişken + shared class; widget içinde tema rengi kopyalamak yok
