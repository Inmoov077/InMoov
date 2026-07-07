/**
 * Reusable Servo Slider component — no emojis, uses icon-svg system
 */
window.createServoSlider = function(name, config, currentAngle, options = {}) {
    const el = document.createElement('div');
    el.className = 'servo-slider-container';
    el.dataset.servo = name;

    const isLeft = name.startsWith('l_');
    const colorClass = options.colorClass || (isLeft ? 'coral' : '');
    const pinLabel = config.pin !== undefined ? `Pin ${config.pin}` : `Ch ${config.ch}`;
    const angle = currentAngle !== undefined ? currentAngle : config.rest;

    el.innerHTML = `
        <div class="servo-slider-header">
            <span class="servo-slider-name">${formatServoName(name)}</span>
            <span class="servo-slider-value">${angle}°</span>
        </div>
        <input type="range" class="${colorClass}" min="${config.min}" max="${config.max}" value="${angle}" data-servo="${name}">
        <div class="servo-slider-meta">
            <span>${pinLabel}</span>
            <span>${config.type}</span>
            <span>rest ${config.rest}°</span>
        </div>
    `;

    const slider = el.querySelector('input[type="range"]');
    const valueSpan = el.querySelector('.servo-slider-value');

    slider.addEventListener('input', () => {
        const val = parseInt(slider.value);
        valueSpan.textContent = val + '°';
        el.classList.add('active');
        if (options.onInput) options.onInput(name, val);
    });

    slider.addEventListener('change', () => {
        const val = parseInt(slider.value);
        el.classList.remove('active');
        if (options.onChange) options.onChange(name, val);
    });

    el.updateValue = function(newAngle) {
        slider.value = newAngle;
        valueSpan.textContent = newAngle + '°';
    };

    return el;
};

window.updateServoSlider = function(parent, name, angle) {
    const el = parent.querySelector(`[data-servo="${name}"]`);
    if (el && el.updateValue) el.updateValue(angle);
    const input = parent.querySelector(`input[data-servo="${name}"]`);
    if (input) {
        input.value = angle;
        const container = input.closest('.servo-slider-container');
        if (container) {
            const valSpan = container.querySelector('.servo-slider-value');
            if (valSpan) valSpan.textContent = angle + '°';
        }
    }
};

function formatServoName(name) {
    return name.replace('r_', 'R.').replace('l_', 'L.').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
