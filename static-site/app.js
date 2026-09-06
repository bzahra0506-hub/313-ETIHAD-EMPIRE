const rateRows = [
    [35.18,30.63,35.88,33.60],
    [36.58,32.11,36.75,34.21],
    [37.89,33.69,37.89,35.00],
    [39.55,35.18,39.55,35.79],
    [41.13,36.58,41.13,36.66],
    [41.65,37.89,41.65,37.89],
    [41.65,39.55,41.65,39.55],
    [41.65,41.13,41.65,41.13],
    [41.65,41.65,41.65,41.65],
    [41.65,41.65,41.65,41.65],
    [41.65,41.65,41.65,41.65],
    [41.65,41.65,41.65,41.65],
    [41.65,41.65,43.49,41.65],
    [41.65,41.65,46.38,41.65],
    [41.65,41.65,49.88,41.65],
    [41.65,41.65,54.16,43.40],
    [41.65,41.65,59.15,46.20],
    [41.65,41.65,64.93,49.70],
    [41.65,41.65,71.58,53.99],
    [46.46,41.65,79.01,59.06],
    [51.19,41.65,87.33,64.93],
    [56.61,42.35,96.51,71.58],
    [62.65,46.46,106.66,79.01],
    [70.00,51.19,117.69,87.33],
    [78.05,56.61,129.85,96.51],
    [87.15,62.83,143.06,106.66],
    [97.30,70.00,157.50,117.69],
    [108.59,78.05,173.43,129.85],
    [120.93,87.15,191.01,143.06],
    [134.40,97.30,210.44,157.50],
    [149.10,108.59,231.79,173.25],
    [164.94,120.93,255.41,190.40],
    [181.83,134.40,281.40,209.21],
    [199.76,149.10,310.10,229.69],
    [218.75,164.94,338.45,251.13],
    [238.96,181.83,369.34,274.49],
    [260.58,199.76,402.85,299.95],
    [284.38,218.75,439.51,327.51],
    [310.71,238.96,479.63,357.53],
    [339.76,260.58,523.51,390.08],
    [372.14,283.85,571.11,425.25],
    [408.63,308.88,622.91,463.31],
    [450.63,336.09,679.70,504.44],
    [498.40,365.84,742.35,548.89],
    [543.99,396.20,null,null],
    [595.18,430.06,null,null],
    [652.40,468.04,null,null],
    [715.49,510.65,null,null],
    [782.60,558.25,null,null],
];

export function monthlyPremium(age, gender, term) {
    if (String(age).trim() === '' || !Number.isInteger(Number(age)) || !['male', 'female'].includes(gender) || ![10, 20].includes(Number(term))) {
        return null;
    }

    const row = rateRows[Number(age) - 17];
    const column = (Number(term) === 20 ? 2 : 0) + (gender === 'female' ? 1 : 0);

    return row?.[column] ?? null;
}

const calculator = typeof document === 'undefined' ? null : document.querySelector('#calculator');

if (calculator) {
    const currency = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animatedAmounts = new Map();
    const animateAmount = (selector, amount) => {
        const output = document.querySelector(selector);
        if (!animatedAmounts.has(output)) {
            const visual = document.createElement('span');
            visual.setAttribute('aria-hidden', 'true');
            const accessible = document.createElement('span');
            accessible.className = 'sr-only';
            output.replaceChildren(visual, accessible);
            animatedAmounts.set(output, { visual, accessible, current: 0, target: undefined, frame: null });
        }

        const state = animatedAmounts.get(output);
        if (state.target === amount) {
            return;
        }

        cancelAnimationFrame(state.frame);
        state.pop?.cancel();
        state.target = amount;
        output.classList.toggle('has-amount', amount !== null);
        state.accessible.textContent = amount === null ? '—' : currency.format(amount);

        if (amount === null || reducedMotion.matches) {
            state.current = amount ?? 0;
            state.visual.textContent = state.accessible.textContent;
            return;
        }

        if (output.closest('.person-total')) {
            state.pop = state.visual.animate([
                { transform: 'translateY(0) scale(1)' },
                { transform: 'translateY(-3px) scale(1.04)', offset: 0.4 },
                { transform: 'translateY(0) scale(1)' },
            ], { duration: 450, easing: 'ease-out' });
        }

        const startAmount = state.current;
        const startTime = performance.now();
        const tick = (time) => {
            const progress = reducedMotion.matches ? 1 : Math.min((time - startTime) / 450, 1);
            const easedProgress = 1 - (1 - progress) ** 3;
            state.current = progress === 1 ? amount : startAmount + (amount - startAmount) * easedProgress;
            state.visual.textContent = currency.format(state.current);
            if (progress < 1) {
                state.frame = requestAnimationFrame(tick);
            }
        };

        state.frame = requestAnimationFrame(tick);
    };
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            animatedAmounts.forEach((state) => state.pop?.cancel());
        }
    });
    const maleAge = document.querySelector('#male-age');
    const femaleAge = document.querySelector('#female-age');
    const render = () => {
        const term = Number(calculator.elements.term.value);
        const maximumAge = term === 20 ? 60 : 65;
        const malePremium = monthlyPremium(maleAge.value, 'male', term);
        const femalePremium = monthlyPremium(femaleAge.value, 'female', term);
        const errors = [];

        for (const [input, gender, premium] of [[maleAge, 'lelaki', malePremium], [femaleAge, 'wanita', femalePremium]]) {
            for (const option of input.options) {
                option.disabled = Number(option.value) > maximumAge;
            }
            const decrease = calculator.querySelector(`[data-age-target="${input.id}"][data-age-step="-1"]`);
            const increase = calculator.querySelector(`[data-age-target="${input.id}"][data-age-step="1"]`);
            decrease.disabled = input.value === '' || Number(input.value) <= 17;
            increase.disabled = input.value !== '' && Number(input.value) >= maximumAge;
            const invalid = input.validity.badInput || (input.value !== '' && premium === null);
            input.setAttribute('aria-invalid', String(invalid));
            input.setAttribute('aria-describedby', 'age-hint input-error');
            if (invalid) {
                errors.push(`Masukkan umur ${gender} antara 17–${maximumAge} tahun (nombor bulat) untuk tempoh ${term} tahun.`);
            }
        }

        animateAmount('#male-premium', malePremium);
        animateAmount('#female-premium', femalePremium);
        animateAmount('#couple-premium', malePremium === null || femalePremium === null ? null : (Math.round(malePremium * 100) + Math.round(femalePremium * 100)) / 100);
        document.querySelector('#term-badge').textContent = `${term} tahun`;
        document.querySelector('#age-hint').textContent = `Umur kemasukan: 17–${maximumAge} tahun untuk tempoh ${term} tahun.`;
        document.querySelector('#input-error').textContent = errors.join(' ');
        document.querySelector('#total-caption').textContent = errors.length ? 'Semak umur pasangan untuk melihat jumlah sumbangan.' : malePremium === null || femalePremium === null ? 'Masukkan umur lelaki dan wanita untuk mula mengira.' : `Lelaki ${maleAge.value} tahun + wanita ${femaleAge.value} tahun · kadar dalam jadual`;
    };

    calculator.addEventListener('submit', (event) => event.preventDefault());
    calculator.addEventListener('input', render);
    calculator.addEventListener('change', render);
    calculator.querySelectorAll('[data-age-step]').forEach((button) => {
        button.addEventListener('click', () => {
            const select = document.getElementById(button.dataset.ageTarget);
            const maximumAge = Number(calculator.elements.term.value) === 20 ? 60 : 65;
            const nextAge = select.value === '' ? 17 : Number(select.value) + Number(button.dataset.ageStep);
            select.value = String(Math.max(17, Math.min(maximumAge, nextAge)));
            render();
        });
    });
    document.querySelector('#reset').addEventListener('click', () => {
        calculator.reset();
        render();
        maleAge.focus();
    });
    render();
}
const ageSelects = [
    document.getElementById('male-age'),
    document.getElementById('female-age'),
];

ageSelects.forEach((select) => {
    for (let age = 17; age <= 65; age++) {
        const option = document.createElement('option');

        option.value = age;
        option.textContent = `${age} tahun`;

        select.appendChild(option);
    }
});