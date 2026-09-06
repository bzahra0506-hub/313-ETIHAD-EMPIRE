<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Kalkulator hibah pasangan untuk ejen.">
    <title>Kalkulator Hibah Couple</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <main class="workspace">
        <form id="calculator" class="calculator" autocomplete="off">
            <fieldset class="term-field">
                <legend>Tempoh perlindungan</legend>
                <div class="term-options">
                    <label><input type="radio" name="term" value="10" checked><span>10 tahun</span></label>
                    <label><input type="radio" name="term" value="20"><span>20 tahun</span></label>
                </div>
            </fieldset>

            <section class="total-card" aria-label="Jumlah pasangan" aria-live="polite" aria-atomic="true">
                <h2>Jumlah sepasang</h2>
                <div class="total-amount"><output id="couple-premium">—</output><span>/ bulan</span></div>
                <p id="total-caption">Masukkan umur lelaki dan wanita untuk mula mengira.</p>
                <span id="term-badge" class="sr-only">10 tahun</span>
            </section>

            <section class="protection-card" aria-labelledby="protection-title">
                <h1 id="protection-title">Hibah Pasangan Mampu Milik</h1>
                <h2>Manfaat perlindungan</h2>
                <div class="main-benefits">
                    <article><h3>Kematian atas semua sebab</h3><strong>RM 400,000</strong></article>
                    <article><h3>Hilang upaya kekal menyeluruh</h3><strong>RM 400,000</strong></article>
                </div>
            </section>

            <section class="couple-grid" aria-label="Sumbangan individu">
                <div class="person-card">
                    <h2>Lelaki</h2>
                    <div class="person-total"><output id="male-premium" aria-label="Sumbangan bulanan lelaki">—</output><span>/ bulan</span></div>
                    <div class="age-field">
                        <label for="male-age">Umur</label>
                        <div class="age-controls">
                            <button type="button" data-age-target="male-age" data-age-step="-1" aria-label="Kurangkan umur lelaki">−</button>
                            <select id="male-age" name="maleAge" required>
                                <option value="">Pilih umur</option>
                                @for ($age = 17; $age <= 65; $age++)
                                    <option value="{{ $age }}">{{ $age }} tahun</option>
                                @endfor
                            </select>
                            <button type="button" data-age-target="male-age" data-age-step="1" aria-label="Tambah umur lelaki">+</button>
                        </div>
                    </div>
                </div>
                <div class="person-card">
                    <h2>Wanita</h2>
                    <div class="person-total"><output id="female-premium" aria-label="Sumbangan bulanan wanita">—</output><span>/ bulan</span></div>
                    <div class="age-field">
                        <label for="female-age">Umur</label>
                        <div class="age-controls">
                            <button type="button" data-age-target="female-age" data-age-step="-1" aria-label="Kurangkan umur wanita">−</button>
                            <select id="female-age" name="femaleAge" required>
                                <option value="">Pilih umur</option>
                                @for ($age = 17; $age <= 65; $age++)
                                    <option value="{{ $age }}">{{ $age }} tahun</option>
                                @endfor
                            </select>
                            <button type="button" data-age-target="female-age" data-age-step="1" aria-label="Tambah umur wanita">+</button>
                        </div>
                    </div>
                </div>
            </section>
            <div class="input-feedback"><p id="age-hint">Umur kemasukan: 17–65 tahun.</p><p id="input-error" role="status"></p></div>

            <section class="benefit-grid" aria-label="Pecahan manfaat setiap individu">
                <article>
                    <span class="benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-7 4 14 3-10 2 3h3"/></svg></span>
                    <h2>Kematian<br>semula jadi</h2><strong>RM 200,000</strong>
                </article>
                <article>
                    <span class="benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16l1.5-5A2 2 0 0 1 6.4 9.5h11.2a2 2 0 0 1 1.9 1.5L21 16"/><path d="M3 16h18v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/></svg></span>
                    <h2>Kematian<br>kemalangan</h2><strong>RM 200,000</strong>
                </article>
                <article>
                    <span class="benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="7.5" r="1.3" fill="currentColor" stroke="none"/><path d="M12 10v4l-3 5M12 14l3 5M9 12h6"/></svg></span>
                    <h2>Hilang upaya<br>kekal<br>menyeluruh<br>semula jadi</h2><strong>RM 200,000</strong>
                </article>
                <article>
                    <span class="benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="16.5" r="4.5"/><circle cx="12" cy="5" r="1.3" fill="currentColor" stroke="none"/><path d="M12 7v6h5M11 13l3 6M17 16.5a1 1 0 1 0 2 0"/></svg></span>
                    <h2>Hilang upaya<br>kekal<br>menyeluruh<br>kemalangan</h2><strong>RM 200,000</strong>
                </article>
            </section>
            <p class="draft-note">Draf berdasarkan gambar: amaun asas jadual kadar masih menunggu pengesahan. Sumbangan dipaparkan terus daripada jadual, tanpa pelarasan amaun perlindungan.</p>
            <div class="form-actions"><button type="button" id="reset">Mula semula ↺</button></div>
        </form>
    </main>
</body>
</html>

