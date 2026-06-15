# Sirius I — Widget Tasarım Rehberi

> Public guide: [WIDGET-GUIDE.md](./WIDGET-GUIDE.md) · This file is the detailed Sirius I content spec.

Widget **içerik** kuralları. Kabuk, tema değişkenleri ve grid: [`Sirius-Terminal-Theme.md`](./Sirius-Terminal-Theme.md).

**Hedef:** Tüm widget’lar aynı kabukta, veri ön planda, minimum UI gürültüsü. Sirius I birincil referans; Dark/Light aynı class’ları kullanır, sadece renk değişkenleri farklıdır.

---

## Widget anatomisi

Her widget iki katmandan oluşur:

| Katman | Nerede | Sorumluluk |
|--------|--------|------------|
| **Kabuk** | `App.tsx` | Başlık, hint, × kapat, sürükleme tutamacı, resize |
| **Gövde** | `PanelContent.tsx` | Veri / chart / tablo — bu rehberin odağı |

```
┌─ panel-handle ─────────────────────── × ─┐
│  Chart          BTC/USDT · 1h            │
├─ panel-body ─────────────────────────────┤
│  … widget içeriği (PanelContent) …     │
└──────────────────────────────────────────┘
```

**Kural:** Kabuğa widget özel stil ekleme. İçerik `panel-body` içinde, ortak class’larla.

---

## Ortak kurallar

### Renk & semantik

| Class / değişken | Anlam | Kullanım |
|------------------|-------|----------|
| `--text` | Ana veri | Fiyat, sembol, boyut |
| `--text-dim` | Soluk | Tablo başlık, label, hint |
| `--text-muted` | İkincil | Alt metin (header dışı) |
| `--bid` / `.bid` | Alış tarafı | Order book bid satırları |
| `--ask` / `.ask` | Satış tarafı | Order book ask satırları |
| `--up` / `.up` | Pozitif | Yeşil fiyat, +% |
| `--down` / `.down` | Negatif | Kırmızı fiyat, -% |
| `--long` / `.long` | Long pozisyon | Side sütunu |
| `--short` / `.short` | Short pozisyon | Side sütunu |

- Hex veya `rgb()` **hardcode etme** — sadece CSS değişkeni veya semantik class.
- Mavi UI vurgusu (`--handle`, buton) widget **içinde** kullanma; etkileşim kabukta.

### Tipografi

- Font: monospace stack (`SF Mono`, `ui-monospace`, …) — `body`’den miras.
- İçerik: `0.75rem`, `font-variant-numeric: tabular-nums` (sayılar hizalı).
- Label / küçük metin: `0.65rem`–`0.7rem`, `--text-dim`.

### Boyut & grid

- `minW` × `minH` = minimum boyut **ve** yeni açılış boyutu (`panels.ts` → `createLayoutItem`).
- İlk sayı genişlik (kolon), ikinci yükseklik (satır). Kare şart değil — örn. `18×10` geçerli.
- lg grid: 36 kolon, `rowHeight` 11px. Yükseklik ≈ `h × 11px`.

| Widget | minW × minH | Not |
|--------|-------------|-----|
| Chart | 12 × 12 | Ana odak; genişletmeye uygun |
| Order Book | 9 × 9 | Dar sütunlar; dikey scroll beklenir |
| Positions | 6 × 6 | Tablo; min 4 sütun okunabilir |
| Watchlist | 6 × 6 | Liste; tek satır = sembol + değişim |
| Recent Trades | 6 × 6 | Akış; zaman + fiyat + miktar |
| Ticker | 3 × 3 | Kompakt stat kartları |

### Scroll & taşma

- `panel-body` scroll taşır; widget kökü `height: 100%` veya tablo/liste doğal akış.
- Sirius I: panel body scrollbar gizli — içerik sığmalı veya iç scroll (chart canvas) widget içinde.

### Sirius I özel

- Panel başlık: normal case, bar yok, kompakt.
- Border: ince `#2a2a2a`; gölge yok.
- Tablo başlık border Sirius I’da minimal (`App.css` override).
- Watchlist satır border minimal.
- Chart: grid çizgisi yok (`--grid-line: transparent`), sadece hafif glow.

---

## Ortak bileşen class’ları

| Class | Widget’lar | Dosya |
|-------|------------|-------|
| `.data-table` | Order Book, Positions, Trades | `App.css` |
| `.watchlist` | Watchlist | `App.css` |
| `.ticker-grid` + `.ticker-stat` | Ticker | `App.css` |
| `.panel-content` + `.panel-content--chart` | Chart | `App.css` |

Yeni widget: mümkünse bu class’lardan birini genişlet; yoksa `panel-body` içinde yeni **ortak** class ekle (`App.css`), widget’a özel renk şeridi ekleme.

---

## Widget bazlı spesifikasyon

### Chart (`kind: chart`)

**Amaç:** Fiyat grafiği / candlestick alanı.

| Özellik | Değer |
|---------|-------|
| Kök class | `panel-content panel-content--chart` |
| Min boyut | 12 × 12 |
| İdeal genişletme | Geniş > yüksek (ör. 24×14) |

**İçerik kuralları**

- Chart canvas veya SVG `panel-content` içinde `flex: 1`, tam genişlik.
- Grid çizgileri: `--grid-line` (Sirius I’da görünmez).
- Fiyat çizgisi / candle: `--bid` veya nötr `--text`; çok renkli palet kullanma.
- Alt gradient: `--chart-glow` (Sirius I’da minimal).
- Placeholder metin: `.content-hint`, `--text-dim`.

**Yapma**

- Ayrı chart toolbar (timeframe, indicator) — header `hint` veya gelecekte in-chart minimal kontrol.
- Widget içi border-radius > 2px (Sirius I).

---

### Order Book (`kind: orderbook`)

**Amaç:** Bid/ask derinlik tablosu.

| Özellik | Değer |
|---------|-------|
| Kök class | `table.data-table` |
| Min boyut | 9 × 9 |
| Sütunlar | Price · Size · Total (veya eşdeğeri) |

**Satır semantiği**

| Class | Anlam |
|-------|-------|
| `tr.ask` | Satış — tüm hücreler `--ask` |
| `tr.bid` | Alış — tüm hücreler `--bid` |
| `tr.spread` | Spread satırı — ortalanmış, `--text-dim`, küçük font |

**Hizalama**

- İlk sütun (Price): sola.
- Sayı sütunları: sağa, tabular-nums.

**Gelecek (canlı veri)**

- Depth bar arka planı: `opacity` düşük `--bid` / `--ask`; metin üstte.
- Güncelleme: satır flash yok veya çok kısa; Sirius I sakin kalmalı.

---

### Positions (`kind: positions`)

**Amaç:** Açık pozisyonlar tablosu.

| Özellik | Değer |
|---------|-------|
| Kök class | `table.data-table` |
| Min boyut | 6 × 6 |
| Sütunlar | Symbol · Side · Size · PnL |

**Hücre semantiği**

| Class | Kullanım |
|-------|----------|
| `.long` / `.short` | Side sütunu |
| `.up` / `.down` | PnL ve pozitif/negatif değerler |

**Kural:** Sembol nötr `--text`. Renk sadece yön ve PnL’de.

---

### Watchlist (`kind: watchlist`)

**Amaç:** Sembol listesi + 24s değişim (veya last price).

| Özellik | Değer |
|---------|-------|
| Kök class | `ul.watchlist` |
| Min boyut | 6 × 6 |
| Satır | `li` — flex, space-between |

**Yapı (satır başına)**

```html
<li>
  <span>ETH/USDT</span>      <!-- nötr -->
  <span class="up">+2.4%</span>  <!-- veya .down -->
</li>
```

- Ayırıcı: `border-bottom: var(--panel-border)`.
- Tıklanabilir satır (gelecek): hover arka plan çok hafif; Sirius I’da `#1a1a1a` tonu, yeni renk tanımlama.

---

### Recent Trades (`kind: trades`)

**Amaç:** Son işlemler akışı (time, price, qty).

| Özellik | Değer |
|---------|-------|
| Kök class | `table.data-table` |
| Min boyut | 6 × 6 |
| Sütunlar | Time · Price · Qty |

**Kural**

- Time: `--text-dim` veya nötr.
- Price: işlem yönüne göre `.up` (buy/agresif alış) veya `.down` — exchange convention’a uy.
- Qty: nötr `--text`.
- En yeni üstte; uzun liste `panel-body` scroll.

---

### Ticker (`kind: ticker`)

**Amaç:** Özet market istatistikleri (24h high/low, volume, funding).

| Özellik | Değer |
|---------|-------|
| Kök class | `div.ticker-grid` |
| Min boyut | 3 × 3 |
| Layout | 2×2 CSS grid (`ticker-stat` kartları) |

**Kart yapısı**

```html
<div class="ticker-stat">
  <span class="ticker-label">24h High</span>
  <span class="ticker-value">68,120</span>
</div>
```

- Label: `.ticker-label` — uppercase, küçük, `--text-dim`.
- Value: `.ticker-value` — kalın, `--text`; yönlü değerler `.up` / `.down`.

**Min 3×3:** 4 stat kartı sığar; daha fazla stat için widget büyüt veya grid kolon sayısını `App.css`’te ortak güncelle.

---

## Yeni widget ekleme checklist

1. **`src/panels.ts`** — `id`, `title`, `hint`, `kind`, `grid` (`minW`/`minH` = ideal açılış).
2. **`PanelContent.tsx`** — yeni `case`; ortak class kullan.
3. **`App.css`** — yalnızca yeni **paylaşılan** pattern gerekiyorsa stil ekle.
4. **`WidgetSelect.tsx`** — katalogdan otomatik (`PANEL_CATALOG`).
5. **Sirius I** — gerekirse `[data-theme='sirius-i']` override; widget başına renk şeridi yok.
6. **Bu rehber** — yeni widget bölümü ekle.

---

## Veri formatı

| Tür | Format |
|-----|--------|
| Fiyat | Binlik ayırıcı, ondalık exchange’e göre (`67,840.20`) |
| Yüzde | İşaret + bir ondalık (`+2.4%`, `-0.8%`) |
| Zaman | `HH:mm:ss` (trades) |
| Sembol | `BASE/QUOTE` büyük harf |
| PnL | İşaret + para birimi (`+$312`, `-$48`) |

Tüm sayılar `tabular-nums` ile hizalanır.

---

## Yap / Yapma özeti

| Yap | Yapma |
|-----|--------|
| Semantik class (`bid`, `ask`, `up`, `down`) | Hex renk kopyalama |
| Ortak `.data-table`, `.watchlist`, `.ticker-grid` | Widget başına farklı kabuk |
| `panels.ts` min = ideal boyut | Rastgele grid boyutu catalog dışı |
| Kompakt padding, veri yoğun | Büyük başlık, ikon şovu |
| Sirius I: sessiz, border-minimal | Chart’ta gökkuşağı indicator seti |

---

## İlgili dosyalar

| Dosya | Rol |
|-------|-----|
| `src/panels.ts` | Katalog, min boyutlar |
| `src/PanelContent.tsx` | Widget içerik |
| `src/App.css` | Ortak widget stilleri + Sirius I override |
| `src/index.css` | Tema değişkenleri |
| `docs/Sirius-Terminal-Theme.md` | Kabuk, grid, tema |
