/**
 * Virtual Joystick component for driving the robot base.
 *
 * createJoystick(options) → HTMLElement
 *   options: {
 *       size:     200,
 *       onChange: fn(speed, turn)   // -100..+100 each
 *   }
 */
window.createJoystick = function(options = {}) {
    const size = options.size || 200;
    const knobSize = size * 0.3;
    const maxDist = (size - knobSize) / 2;

    const container = document.createElement('div');
    container.className = 'joystick-container';
    container.style.width = size + 'px';
    container.style.height = size + 'px';

    container.innerHTML = `
        <div class="joystick-knob" style="width:${knobSize}px;height:${knobSize}px"></div>
        <div class="joystick-labels">
            <span class="label-top">FWD</span>
            <span class="label-bottom">REV</span>
            <span class="label-left">LEFT</span>
            <span class="label-right">RIGHT</span>
        </div>
    `;

    const knob = container.querySelector('.joystick-knob');
    let dragging = false;
    let cx = 0, cy = 0;

    function updateKnob(px, py) {
        // px, py relative to center, in pixels
        const dist = Math.sqrt(px * px + py * py);
        if (dist > maxDist) {
            px = px / dist * maxDist;
            py = py / dist * maxDist;
        }
        cx = px;
        cy = py;
        knob.style.left = `calc(50% + ${px}px)`;
        knob.style.top = `calc(50% + ${py}px)`;

        // Convert to speed (-100..100) and turn (-100..100)
        const speed = Math.round(-cy / maxDist * 100);
        const turn = Math.round(px / maxDist * 100);
        if (options.onChange) options.onChange(speed, turn);
    }

    function getRelativePos(e) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - centerX, y: clientY - centerY };
    }

    function onStart(e) {
        e.preventDefault();
        dragging = true;
        knob.style.transition = 'none';
    }

    function onMove(e) {
        if (!dragging) return;
        e.preventDefault();
        const pos = getRelativePos(e);
        updateKnob(pos.x, pos.y);
    }

    function onEnd() {
        dragging = false;
        cx = 0; cy = 0;
        knob.style.transition = 'left 0.3s ease, top 0.3s ease';
        knob.style.left = '50%';
        knob.style.top = '50%';
        if (options.onChange) options.onChange(0, 0);
    }

    // Mouse events
    knob.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Touch events
    knob.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    // Cleanup
    container._cleanup = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
    };

    return container;
};
