/**
 * Body Control View
 */
window.mount_body_control = function(container, State, socket) {
    const groups = {
        r_arm:  { label: 'Right Arm',  servos: ['r_shoulder', 'r_omoplate', 'r_bicep', 'r_rotate'] },
        r_hand: { label: 'Right Hand', servos: ['r_thumb', 'r_index', 'r_middle', 'r_ring', 'r_pinky', 'r_wrist'] },
        l_arm:  { label: 'Left Arm',   servos: ['l_shoulder', 'l_omoplate', 'l_bicep', 'l_rotate'] },
        l_hand: { label: 'Left Hand',  servos: ['l_thumb', 'l_index', 'l_middle', 'l_ring', 'l_pinky', 'l_wrist'] },
    };

    container.innerHTML = `
        <div class="page-header fade-in">
            <h2>${ic('arm')} Body Control</h2>
            <p>Click a joint on the body diagram or use the sliders</p>
        </div>
        <div class="body-control-layout">
            <div class="svg-panel">
                <div id="bc-svg-container"></div>
                <div class="card" style="margin-top:12px">
                    <div class="card-header"><h3>${ic('hand')} Grip Controls</h3></div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                        <button class="btn btn-primary btn-sm" id="grip-right-btn">${ic('hand')} Right</button>
                        <button class="btn btn-sm" id="grip-left-btn" style="border-color:rgba(243,195,178,0.2);color:var(--coral)">${ic('hand')} Left</button>
                        <button class="btn btn-sm" id="grip-both-btn">${ic('hand')} Both</button>
                        <div style="flex:1;min-width:120px">
                            <label style="font-size:9px;color:var(--text-muted);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.8px">Strength</label>
                            <input type="range" min="0" max="100" value="80" id="grip-strength">
                        </div>
                    </div>
                </div>
            </div>
            <div class="controls-panel" id="bc-controls"></div>
        </div>
    `;

    const svgContainer = document.getElementById('bc-svg-container');
    let svgBody = null;
    if (window.createSVGBody) {
        svgBody = window.createSVGBody({
            height: '420px',
            onJointClick: (name) => {
                const slider = document.querySelector(`.servo-slider-container[data-servo="${name}"]`);
                if (slider) { slider.scrollIntoView({ behavior: 'smooth', block: 'center' }); slider.classList.add('active'); setTimeout(() => slider.classList.remove('active'), 2000); }
            }
        });
        svgContainer.appendChild(svgBody);
    }

    const controlsPanel = document.getElementById('bc-controls');
    const accordion = document.createElement('div');
    accordion.className = 'accordion';

    const groupIcons = { r_arm: 'arm', r_hand: 'hand', l_arm: 'arm', l_hand: 'hand' };

    Object.entries(groups).forEach(([groupKey, group]) => {
        const isEnabled = State.enabledParts[groupKey] !== false;
        const item = document.createElement('div');
        item.className = 'accordion-item open';

        item.innerHTML = `
            <div class="accordion-header">
                <h4>${ic(groupIcons[groupKey])} ${group.label}</h4>
                <div style="display:flex;align-items:center;gap:10px">
                    <label class="toggle-switch"><input type="checkbox" data-group-toggle="${groupKey}" ${isEnabled ? 'checked' : ''}><span class="toggle-slider"></span></label>
                    <span class="accordion-chevron">${ic('chevronRight')}</span>
                </div>
            </div>
            <div class="accordion-body"><div class="accordion-content" id="sliders-${groupKey}"></div></div>
        `;

        item.querySelector('.accordion-header').addEventListener('click', (e) => {
            if (e.target.closest('.toggle-switch')) return;
            item.classList.toggle('open');
        });

        item.querySelector(`[data-group-toggle="${groupKey}"]`).addEventListener('change', function() {
            socket.emit('set_part_enabled', { part: groupKey, enabled: this.checked });
        });

        accordion.appendChild(item);

        const slidersContainer = item.querySelector(`#sliders-${groupKey}`);
        group.servos.forEach(servoName => {
            const config = State.limits[servoName];
            if (!config) return;
            const angle = State.servos[servoName] ?? config.rest;
            slidersContainer.appendChild(window.createServoSlider(servoName, config, angle, {
                onInput: (name, val) => { socket.emit('move_servo', { servo: name, angle: val }); if (svgBody) svgBody.highlightJoint(name); },
                onChange: (name, val) => { socket.emit('move_servo', { servo: name, angle: val }); }
            }));
        });
    });

    controlsPanel.appendChild(accordion);

    const gripStrength = document.getElementById('grip-strength');
    document.getElementById('grip-right-btn')?.addEventListener('click', () => socket.emit('grip', { side: 'right', percentage: parseInt(gripStrength.value) }));
    document.getElementById('grip-left-btn')?.addEventListener('click', () => socket.emit('grip', { side: 'left', percentage: parseInt(gripStrength.value) }));
    document.getElementById('grip-both-btn')?.addEventListener('click', () => socket.emit('grip', { side: 'both', percentage: parseInt(gripStrength.value) }));

    const onStatus = (data) => {
        if (data.servos) Object.entries(data.servos).forEach(([name, angle]) => window.updateServoSlider(controlsPanel, name, angle));
    };
    State.on('status', onStatus);

    const onEnabled = (data) => {
        Object.entries(data).forEach(([part, enabled]) => {
            const t = document.querySelector(`[data-group-toggle="${part}"]`);
            if (t) t.checked = enabled;
        });
    };
    State.on('enabledParts', onEnabled);

    if (State.selectedJoint) {
        setTimeout(() => {
            if (svgBody) svgBody.highlightJoint(State.selectedJoint);
            const slider = document.querySelector(`.servo-slider-container[data-servo="${State.selectedJoint}"]`);
            if (slider) slider.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    container._cleanup = () => { State.off('status', onStatus); State.off('enabledParts', onEnabled); };
};
