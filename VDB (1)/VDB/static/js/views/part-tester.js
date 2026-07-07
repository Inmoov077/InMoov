/**
 * Part Tester View — Enhanced with quick-action buttons
 * Open / Close / Center for each finger + whole hand controls
 */
window.mount_part_tester = function(container, State, socket) {
    const parts = {
        r_arm:  { label: 'Right Arm',  servos: ['r_shoulder', 'r_omoplate', 'r_bicep', 'r_rotate'], color: '', type: 'arm' },
        r_hand: { label: 'Right Hand', servos: ['r_thumb', 'r_index', 'r_middle', 'r_ring', 'r_pinky', 'r_wrist'], color: '', type: 'hand' },
        l_arm:  { label: 'Left Arm',   servos: ['l_shoulder', 'l_omoplate', 'l_bicep', 'l_rotate'], color: 'coral', type: 'arm' },
        l_hand: { label: 'Left Hand',  servos: ['l_thumb', 'l_index', 'l_middle', 'l_ring', 'l_pinky', 'l_wrist'], color: 'coral', type: 'hand' },
    };

    // Finger servos (excludes wrist)
    const fingerServos = {
        r_hand: ['r_thumb', 'r_index', 'r_middle', 'r_ring', 'r_pinky'],
        l_hand: ['l_thumb', 'l_index', 'l_middle', 'l_ring', 'l_pinky'],
    };

    let selectedPart = null;

    container.innerHTML = `
        <div class="page-header fade-in">
            <h2>${ic('flask')} Part Tester</h2>
            <p>Select a body part to test its servos — use quick buttons or sliders</p>
        </div>
        <div class="grid-4 stagger" id="pt-selector"></div>
        <div id="pt-test-panel" style="display:none;margin-top:16px">
            <div class="card card-active">
                <div class="card-header">
                    <h3 id="pt-panel-title">${ic('flask')} Testing</h3>
                    <div class="btn-group">
                        <button class="btn btn-primary btn-sm" id="pt-sweep-btn">${ic('refresh')} Sweep Test</button>
                        <button class="btn btn-sm" id="pt-home-btn">${ic('crosshair')} Home All</button>
                        <button class="btn btn-sm" id="pt-back-btn">${ic('arrowLeft')} Back</button>
                    </div>
                </div>

                <!-- Quick Actions Bar (shown for hands) -->
                <div id="pt-quick-actions" style="display:none"></div>

                <!-- Individual Finger Controls (shown for hands) -->
                <div id="pt-finger-controls" style="display:none"></div>

                <!-- Sliders for fine-tuning -->
                <div style="margin-top:12px">
                    <h4 class="pt-section-label">${ic('sliders')} Fine-Tune Sliders</h4>
                    <div id="pt-sliders"></div>
                </div>

                <div style="margin-top:12px">
                    <h4 class="pt-section-label">Test Log</h4>
                    <div id="pt-log"></div>
                </div>
            </div>
        </div>
    `;

    const partIcons = { r_arm: 'arm', r_hand: 'hand', l_arm: 'arm', l_hand: 'hand' };
    const selector = document.getElementById('pt-selector');

    Object.entries(parts).forEach(([key, part]) => {
        const card = document.createElement('div');
        card.className = 'part-card';
        card.dataset.part = key;
        card.innerHTML = `
            <div class="part-icon">${ic(partIcons[key])}</div>
            <span class="part-name">${part.label}</span>
            <span class="part-servos">${part.servos.length} servos</span>
        `;
        card.addEventListener('click', () => selectPart(key));
        selector.appendChild(card);
    });

    function moveServo(name, angle) {
        socket.emit('move_servo', { servo: name, angle: angle });
    }

    function moveServosMulti(servosAndAngles) {
        servosAndAngles.forEach(([name, angle]) => {
            socket.emit('move_servo', { servo: name, angle: angle });
        });
    }

    function getMin(name) {
        return State.limits[name]?.min ?? 0;
    }
    function getMax(name) {
        return State.limits[name]?.max ?? 180;
    }
    function getRest(name) {
        return State.limits[name]?.rest ?? 90;
    }
    function getCenter(name) {
        const min = getMin(name);
        const max = getMax(name);
        return Math.round((min + max) / 2);
    }

    function buildQuickActions(partKey) {
        const qa = document.getElementById('pt-quick-actions');
        if (!fingerServos[partKey]) {
            qa.style.display = 'none';
            return;
        }
        qa.style.display = 'block';

        const fingers = fingerServos[partKey];
        const side = partKey === 'r_hand' ? 'Right' : 'Left';
        const wristServo = partKey === 'r_hand' ? 'r_wrist' : 'l_wrist';

        qa.innerHTML = `
            <h4 class="pt-section-label">${ic('hand')} ${side} Hand — Quick Actions</h4>
            <div class="pt-action-grid">
                <button class="pt-action-btn pt-btn-open" id="pt-open-all" title="Open all fingers fully">
                    ${ic('hand')} Open Hand
                </button>
                <button class="pt-action-btn pt-btn-close" id="pt-close-all" title="Close all fingers fully">
                    ✊ Close Hand
                </button>
                <button class="pt-action-btn pt-btn-center" id="pt-center-all" title="Center all servos (midpoint)">
                    ${ic('crosshair')} Center All
                </button>
                <button class="pt-action-btn pt-btn-rest" id="pt-rest-all" title="Return all to rest positions">
                    ${ic('home')} Rest Position
                </button>
                <button class="pt-action-btn pt-btn-wrist-center" id="pt-wrist-center" title="Center wrist servo">
                    ${ic('refresh')} Wrist Center
                </button>
                <button class="pt-action-btn pt-btn-wrist-min" id="pt-wrist-min" title="Wrist to minimum">
                    ↙ Wrist Min
                </button>
                <button class="pt-action-btn pt-btn-wrist-max" id="pt-wrist-max" title="Wrist to maximum">
                    ↗ Wrist Max
                </button>
            </div>
        `;

        // Open All — all fingers to their MIN (fingers open when at min angle)
        qa.querySelector('#pt-open-all').addEventListener('click', () => {
            const moves = fingers.map(f => [f, getMin(f)]);
            moveServosMulti(moves);
            updateSlidersUI(moves);
        });

        // Close All — all fingers to their MAX (fingers close when at max angle)
        qa.querySelector('#pt-close-all').addEventListener('click', () => {
            const moves = fingers.map(f => [f, getMax(f)]);
            moveServosMulti(moves);
            updateSlidersUI(moves);
        });

        // Center All — all servos to midpoint
        qa.querySelector('#pt-center-all').addEventListener('click', () => {
            const allServos = [...fingers, wristServo];
            const moves = allServos.map(s => [s, getCenter(s)]);
            moveServosMulti(moves);
            updateSlidersUI(moves);
        });

        // Rest All — all servos to rest position
        qa.querySelector('#pt-rest-all').addEventListener('click', () => {
            const allServos = parts[partKey].servos;
            const moves = allServos.map(s => [s, getRest(s)]);
            moveServosMulti(moves);
            updateSlidersUI(moves);
        });

        // Wrist controls
        qa.querySelector('#pt-wrist-center').addEventListener('click', () => {
            const angle = getCenter(wristServo);
            moveServo(wristServo, angle);
            updateSlidersUI([[wristServo, angle]]);
        });
        qa.querySelector('#pt-wrist-min').addEventListener('click', () => {
            const angle = getMin(wristServo);
            moveServo(wristServo, angle);
            updateSlidersUI([[wristServo, angle]]);
        });
        qa.querySelector('#pt-wrist-max').addEventListener('click', () => {
            const angle = getMax(wristServo);
            moveServo(wristServo, angle);
            updateSlidersUI([[wristServo, angle]]);
        });
    }

    function buildFingerControls(partKey) {
        const fc = document.getElementById('pt-finger-controls');
        if (!fingerServos[partKey]) {
            fc.style.display = 'none';
            return;
        }
        fc.style.display = 'block';

        const fingers = fingerServos[partKey];
        const fingerLabels = {
            'r_thumb': 'Thumb', 'r_index': 'Index', 'r_middle': 'Middle', 'r_ring': 'Ring', 'r_pinky': 'Pinky',
            'l_thumb': 'Thumb', 'l_index': 'Index', 'l_middle': 'Middle', 'l_ring': 'Ring', 'l_pinky': 'Pinky',
        };
        const fingerEmojis = {
            'r_thumb': '👍', 'r_index': '☝️', 'r_middle': '🖕', 'r_ring': '💍', 'r_pinky': '🤙',
            'l_thumb': '👍', 'l_index': '☝️', 'l_middle': '🖕', 'l_ring': '💍', 'l_pinky': '🤙',
        };

        let html = `<h4 class="pt-section-label">${ic('target')} Individual Finger Controls</h4>`;
        html += '<div class="pt-finger-grid">';

        fingers.forEach(name => {
            const label = fingerLabels[name] || name;
            const emoji = fingerEmojis[name] || '🔹';
            const min = getMin(name);
            const max = getMax(name);
            const center = getCenter(name);
            const rest = getRest(name);
            const current = State.servos[name] ?? rest;

            html += `
                <div class="pt-finger-card" data-finger="${name}">
                    <div class="pt-finger-header">
                        <span class="pt-finger-emoji">${emoji}</span>
                        <span class="pt-finger-name">${label}</span>
                        <span class="pt-finger-angle" id="fc-angle-${name}">${current}°</span>
                    </div>
                    <div class="pt-finger-range">
                        <span class="pt-range-label">${min}°</span>
                        <div class="pt-finger-bar">
                            <div class="pt-finger-bar-fill" id="fc-bar-${name}" style="width:${((current - min) / (max - min)) * 100}%"></div>
                        </div>
                        <span class="pt-range-label">${max}°</span>
                    </div>
                    <div class="pt-finger-btns">
                        <button class="pt-fbtn pt-fbtn-open" data-action="open" data-servo="${name}" title="Open (${min}°)">Open</button>
                        <button class="pt-fbtn pt-fbtn-center" data-action="center" data-servo="${name}" title="Center (${center}°)">Center</button>
                        <button class="pt-fbtn pt-fbtn-close" data-action="close" data-servo="${name}" title="Close (${max}°)">Close</button>
                        <button class="pt-fbtn pt-fbtn-rest" data-action="rest" data-servo="${name}" title="Rest (${rest}°)">Rest</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        fc.innerHTML = html;

        // Attach finger button listeners
        fc.querySelectorAll('.pt-fbtn').forEach(btn => {
            btn.addEventListener('click', () => {
                const servo = btn.dataset.servo;
                const action = btn.dataset.action;
                let angle;
                if (action === 'open')   angle = getMin(servo);
                if (action === 'close')  angle = getMax(servo);
                if (action === 'center') angle = getCenter(servo);
                if (action === 'rest')   angle = getRest(servo);

                moveServo(servo, angle);
                updateSlidersUI([[servo, angle]]);
                updateFingerUI(servo, angle);

                // Button flash feedback
                btn.classList.add('pt-fbtn-active');
                setTimeout(() => btn.classList.remove('pt-fbtn-active'), 300);
            });
        });
    }

    function updateFingerUI(name, angle) {
        const angleEl = document.getElementById(`fc-angle-${name}`);
        const barEl = document.getElementById(`fc-bar-${name}`);
        if (angleEl) angleEl.textContent = angle + '°';
        if (barEl) {
            const min = getMin(name);
            const max = getMax(name);
            barEl.style.width = ((angle - min) / (max - min)) * 100 + '%';
        }
    }

    function updateSlidersUI(servosAndAngles) {
        const slidersContainer = document.getElementById('pt-sliders');
        servosAndAngles.forEach(([name, angle]) => {
            window.updateServoSlider(slidersContainer, name, angle);
        });
    }

    function selectPart(partKey) {
        selectedPart = partKey;
        const part = parts[partKey];

        document.querySelectorAll('.part-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.part-card[data-part="${partKey}"]`)?.classList.add('selected');

        const panel = document.getElementById('pt-test-panel');
        panel.style.display = 'block';
        document.getElementById('pt-panel-title').innerHTML = `${ic('flask')} Testing: ${part.label}`;

        // Build quick actions (for hands)
        buildQuickActions(partKey);
        buildFingerControls(partKey);

        // Build sliders
        const slidersContainer = document.getElementById('pt-sliders');
        slidersContainer.innerHTML = '';
        part.servos.forEach(servoName => {
            const config = State.limits[servoName];
            if (!config) return;
            const angle = State.servos[servoName] ?? config.rest;
            slidersContainer.appendChild(window.createServoSlider(servoName, config, angle, {
                colorClass: part.color,
                onInput: (name, val) => {
                    socket.emit('move_servo', { servo: name, angle: val });
                    updateFingerUI(name, val);
                },
                onChange: (name, val) => {
                    socket.emit('move_servo', { servo: name, angle: val });
                    updateFingerUI(name, val);
                }
            }));
        });

        const logContainer = document.getElementById('pt-log');
        logContainer.innerHTML = '';
        if (window.createSerialLog) {
            logContainer.appendChild(window.createSerialLog({
                height: '120px', showInput: false,
                filter: (entry) => part.servos.some(s => entry.data.includes(s)) || entry.type === 'system'
            }));
        }

        // Scroll to panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.getElementById('pt-sweep-btn')?.addEventListener('click', () => { if (selectedPart) socket.emit('sweep_test', { part: selectedPart, action: 'start' }); });
    document.getElementById('pt-home-btn')?.addEventListener('click', () => {
        if (!selectedPart) return;
        const moves = parts[selectedPart].servos.map(s => {
            const c = State.limits[s];
            return [s, c ? c.rest : 90];
        });
        moveServosMulti(moves);
        updateSlidersUI(moves);
        moves.forEach(([name, angle]) => updateFingerUI(name, angle));
    });
    document.getElementById('pt-back-btn')?.addEventListener('click', () => {
        selectedPart = null;
        document.querySelectorAll('.part-card').forEach(c => c.classList.remove('selected'));
        document.getElementById('pt-test-panel').style.display = 'none';
    });

    const onStatus = (data) => {
        if (!selectedPart || !data.servos) return;
        const slidersContainer = document.getElementById('pt-sliders');
        parts[selectedPart].servos.forEach(name => {
            if (data.servos[name] !== undefined) {
                window.updateServoSlider(slidersContainer, name, data.servos[name]);
                updateFingerUI(name, data.servos[name]);
            }
        });
    };
    State.on('status', onStatus);

    container._cleanup = () => State.off('status', onStatus);
};
