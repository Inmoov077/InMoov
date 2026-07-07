/**
 * Mobility / Drive Base View
 */
window.mount_mobility = function(container, State, socket) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <h2>${ic('compass')} Mobility Base</h2>
            <p>Drive the robot base using the virtual joystick or keyboard (WASD / Arrow keys)</p>
        </div>

        <div class="mobility-layout">
            <div class="card">
                <div class="card-header">
                    <h3>${ic('joystick')} Drive Control</h3>
                    <span class="badge badge-cream" id="mob-drive-status">Idle</span>
                </div>
                <div class="drive-panel">
                    <div id="mob-joystick-mount"></div>
                    <div class="speed-display">
                        <span>Speed: <span class="value" id="mob-speed">0</span>%</span>
                        <span>Turn: <span class="value" id="mob-turn">0</span>%</span>
                    </div>
                    <div class="btn-group" style="margin-top:6px">
                        <button class="btn btn-primary btn-sm" id="mob-stop-btn">${ic('stop')} Stop</button>
                        <button class="btn btn-sm" id="mob-slow-btn">${ic('shield')} Slow Mode</button>
                    </div>
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px">
                <div class="card">
                    <div class="card-header"><h3>${ic('keyboard')} Keyboard Controls</h3></div>
                    <div style="font-size:11px;color:var(--text-secondary);line-height:2.2">
                        <div><span class="badge badge-steel" style="margin-right:6px">W</span> Forward</div>
                        <div><span class="badge badge-steel" style="margin-right:6px">S</span> Reverse</div>
                        <div><span class="badge badge-steel" style="margin-right:6px">A</span> Turn Left</div>
                        <div><span class="badge badge-steel" style="margin-right:6px">D</span> Turn Right</div>
                        <div><span class="badge badge-coral" style="margin-right:6px">Space</span> Emergency Stop</div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h3>${ic('barChart')} Base Status</h3></div>
                    <div class="mobility-stats">
                        <div class="stat-card accent-steel" style="padding:10px">
                            <span class="stat-label" style="font-size:9px">Left Motor</span>
                            <span class="stat-value" style="font-size:18px" id="mob-left-pwr">0%</span>
                        </div>
                        <div class="stat-card accent-coral" style="padding:10px">
                            <span class="stat-label" style="font-size:9px">Right Motor</span>
                            <span class="stat-value" style="font-size:18px" id="mob-right-pwr">0%</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h3>${ic('shield')} Safety</h3></div>
                    <div style="font-size:11px;color:var(--text-secondary);line-height:1.8">
                        <p>Acceleration is ramped for stability</p>
                        <p>Max speed is software-limited</p>
                        <p>Release joystick or keys to auto-brake</p>
                        <p>E-STOP always available in sidebar</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const joystickMount = document.getElementById('mob-joystick-mount');
    let slowMode = false;

    if (window.createJoystick) {
        joystickMount.appendChild(window.createJoystick({
            size: 180,
            onChange: (speed, turn) => {
                if (slowMode) { speed = Math.round(speed * 0.4); turn = Math.round(turn * 0.4); }
                sendDrive(speed, turn);
            }
        }));
    }

    function sendDrive(speed, turn) {
        socket.emit('drive', { speed, turn });
        const speedEl = document.getElementById('mob-speed');
        const turnEl = document.getElementById('mob-turn');
        const leftEl = document.getElementById('mob-left-pwr');
        const rightEl = document.getElementById('mob-right-pwr');
        const badge = document.getElementById('mob-drive-status');
        if (!speedEl) return; // View no longer mounted
        speedEl.textContent = speed;
        if (turnEl) turnEl.textContent = turn;
        const left = Math.min(100, Math.max(-100, speed - turn));
        const right = Math.min(100, Math.max(-100, speed + turn));
        if (leftEl) leftEl.textContent = left + '%';
        if (rightEl) rightEl.textContent = right + '%';
        if (badge) {
            if (speed === 0 && turn === 0) { badge.textContent = 'Idle'; badge.className = 'badge badge-cream'; }
            else { badge.textContent = 'Driving'; badge.className = 'badge badge-steel'; }
        }
    }

    document.getElementById('mob-stop-btn')?.addEventListener('click', () => sendDrive(0, 0));
    document.getElementById('mob-slow-btn')?.addEventListener('click', function() {
        slowMode = !slowMode;
        this.style.borderColor = slowMode ? 'var(--cream)' : '';
        this.style.color = slowMode ? 'var(--cream)' : '';
    });

    const keys = {};
    const DRIVE_SPEED = 60, TURN_SPEED = 50;

    function onKeyDown(e) {
        const key = e.key.toLowerCase();
        if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(key)) { e.preventDefault(); keys[key] = true; updateFromKeys(); }
    }
    function onKeyUp(e) { const key = e.key.toLowerCase(); if (key in keys) { delete keys[key]; updateFromKeys(); } }
    function updateFromKeys() {
        let speed = 0, turn = 0;
        const spd = slowMode ? DRIVE_SPEED * 0.4 : DRIVE_SPEED;
        const trn = slowMode ? TURN_SPEED * 0.4 : TURN_SPEED;
        if (keys['w'] || keys['arrowup']) speed += spd;
        if (keys['s'] || keys['arrowdown']) speed -= spd;
        if (keys['a'] || keys['arrowleft']) turn -= trn;
        if (keys['d'] || keys['arrowright']) turn += trn;
        if (keys[' ']) { speed = 0; turn = 0; socket.emit('emergency_stop'); }
        sendDrive(Math.round(speed), Math.round(turn));
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    container._cleanup = () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        sendDrive(0, 0);
    };
};
