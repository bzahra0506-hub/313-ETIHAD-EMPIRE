const MIN_AGE = 20;
const MAX_AGE = 60;

const COVERAGE_AMOUNTS = [50000, 100000, 150000, 200000, 250000];
const BENEFIT_MULTIPLIERS = {
    'benefit-asas': 1,
    'benefit-2x': 2,
    'benefit-3x': 3,
    'benefit-4x': 4,
    'benefit-tpd': 1,
};

const RATE_BANDS = [
    { min: 20, max: 25, Lelaki: [46.00, 92.00, 138.00, 184.00, 230.00], Perempuan: [36.40, 72.75, 109.15, 145.50, 181.90] },
    { min: 26, max: 30, Lelaki: [54.50, 108.35, 162.50, 216.65, 270.85], Perempuan: [40.10, 80.15, 120.25, 160.35, 200.40] },
    { min: 31, max: 35, Lelaki: [67.90, 135.85, 203.75, 271.65, 339.60], Perempuan: [47.00, 94.00, 141.00, 188.00, 235.00] },
    { min: 36, max: 40, Lelaki: [84.55, 169.10, 253.65, 338.15, 422.70], Perempuan: [59.00, 118.00, 177.00, 236.00, 295.00] },
    { min: 41, max: 45, Lelaki: [108.55, 217.10, 325.65, 434.15, 542.70], Perempuan: [74.90, 149.75, 224.65, 299.50, 374.40] },
    { min: 46, max: 50, Lelaki: [142.85, 285.65, 428.50, 571.35, 714.15], Perempuan: [95.15, 190.25, 285.40, 380.50, 475.65] },
    { min: 51, max: 55, Lelaki: [196.20, 392.40, 588.65, 784.85, 981.05], Perempuan: [126.90, 253.85, 380.75, 507.65, 634.60] },
    { min: 56, max: 60, Lelaki: [246.45, 492.90, 739.40, 985.85, 1232.30], Perempuan: [171.95, 343.90, 515.90, 687.85, 859.80] },
];

function monthlyContribution(age, gender, coverageIndex) {
    if (String(age).trim() === '' || !Number.isInteger(Number(age)) || !['Lelaki', 'Perempuan'].includes(gender) || !Number.isInteger(coverageIndex) || coverageIndex < 0 || coverageIndex > 4) {
        return null;
    }

    const band = RATE_BANDS.find((candidate) => Number(age) >= candidate.min && Number(age) <= candidate.max);

    return band?.[gender]?.[coverageIndex] ?? null;
}

const ageSelect = document.getElementById('age');

for (let age = MIN_AGE; age <= MAX_AGE; age++) {
    const option = document.createElement('option');

    option.value = age;
    option.textContent = `${age} tahun`;

    ageSelect.appendChild(option);
}

const calculator = document.querySelector('#calculator');

if (calculator) {
    const currency = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' });
    const totalOutput = document.querySelector('#total-contribution');
    const totalCard = document.querySelector('.total-card');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const amountState = { current: 0, target: undefined, frame: null };

    const animateTotal = (amount) => {
        if (amountState.target === amount) {
            return;
        }

        cancelAnimationFrame(amountState.frame);
        amountState.target = amount;
        totalOutput.classList.toggle('has-amount', amount !== null);

        if (amount === null) {
            amountState.current = 0;
            totalOutput.textContent = 'RM ....';
            return;
        }

        if (reducedMotion.matches) {
            amountState.current = amount;
            totalOutput.textContent = currency.format(amount);
        } else {
            const startAmount = amountState.current;
            const startTime = performance.now();
            const tick = (time) => {
                const progress = Math.min((time - startTime) / 450, 1);
                const eased = 1 - (1 - progress) ** 3;
                amountState.current = progress === 1 ? amount : startAmount + (amount - startAmount) * eased;
                totalOutput.textContent = currency.format(amountState.current);
                if (progress < 1) {
                    amountState.frame = requestAnimationFrame(tick);
                }
            };
            amountState.frame = requestAnimationFrame(tick);

            totalCard.classList.remove('pulse');
            void totalCard.offsetWidth;
            totalCard.classList.add('pulse');
        }
    };

    const coverageSelect = document.getElementById('coverage');
    const benefitAmountFormatter = new Intl.NumberFormat('en-US');
    const benefitStates = Object.keys(BENEFIT_MULTIPLIERS).map((id) => {
        const element = document.getElementById(id);

        return { element, current: Number(element.textContent.replace(/\D/g, '')), target: undefined, frame: null };
    });

    const renderBenefitAmounts = (coverageIndex) => {
        const baseAmount = COVERAGE_AMOUNTS[coverageIndex ?? 0];

        benefitStates.forEach((state) => {
            const amount = baseAmount * BENEFIT_MULTIPLIERS[state.element.id];

            if (state.target === amount) {
                return;
            }

            cancelAnimationFrame(state.frame);
            state.target = amount;

            if (reducedMotion.matches) {
                state.current = amount;
                state.element.textContent = `RM${benefitAmountFormatter.format(amount)}`;
                return;
            }

            const startAmount = state.current;
            const startTime = performance.now();
            const tick = (time) => {
                const progress = Math.min((time - startTime) / 450, 1);
                const eased = 1 - (1 - progress) ** 3;
                state.current = progress === 1 ? amount : Math.round(startAmount + (amount - startAmount) * eased);
                state.element.textContent = `RM${benefitAmountFormatter.format(state.current)}`;
                if (progress < 1) {
                    state.frame = requestAnimationFrame(tick);
                }
            };
            state.frame = requestAnimationFrame(tick);

            const li = state.element.closest('li');
            li.classList.remove('bump');
            void li.offsetWidth;
            li.classList.add('bump');
        });
    };

    const render = () => {
        const genderInput = calculator.querySelector('input[name="gender"]:checked');
        const coverageIndex = coverageSelect.value === '' ? null : Number(coverageSelect.value);
        const gender = genderInput ? genderInput.value : null;
        const contribution = coverageIndex === null || gender === null
            ? null
            : monthlyContribution(ageSelect.value, gender, coverageIndex);

        renderBenefitAmounts(coverageIndex);

        const decrease = calculator.querySelector('[data-age-target="age"][data-age-step="-1"]');
        const increase = calculator.querySelector('[data-age-target="age"][data-age-step="1"]');
        decrease.disabled = ageSelect.value === '' || Number(ageSelect.value) <= MIN_AGE;
        increase.disabled = ageSelect.value === '' || Number(ageSelect.value) >= MAX_AGE;

        const invalid = ageSelect.value !== '' && coverageIndex !== null && gender !== null && contribution === null;
        ageSelect.setAttribute('aria-invalid', String(invalid));
        ageSelect.setAttribute('aria-describedby', 'age-hint input-error');

        document.querySelector('#input-error').textContent = invalid
            ? `Umur perlu antara ${MIN_AGE}–${MAX_AGE} tahun.`
            : '';

        animateTotal(contribution);

        document.querySelector('#total-caption').textContent = contribution === null
            ? 'Pilih perlindungan, jantina dan umur untuk mula mengira.'
            : `${gender} ${ageSelect.value} tahun · perlindungan ${['50K', '100K', '150K', '200K', '250K'][coverageIndex]}`;
    };

    calculator.addEventListener('submit', (event) => event.preventDefault());
    calculator.addEventListener('input', render);
    calculator.addEventListener('change', render);
    calculator.querySelectorAll('[data-age-step]').forEach((button) => {
        button.addEventListener('click', () => {
            const nextAge = ageSelect.value === '' ? MIN_AGE : Number(ageSelect.value) + Number(button.dataset.ageStep);
            ageSelect.value = String(Math.max(MIN_AGE, Math.min(MAX_AGE, nextAge)));
            render();
        });
    });
    document.querySelector('#reset').addEventListener('click', () => {
        calculator.reset();
        render();
        ageSelect.focus();
    });
    render();
}
