/**
 * Patterns & Pose Sequencer View
 */
window.mount_patterns = function(container, State, socket) {
    // Map pattern IDs to icon names
    const patternIcons = {
        gentle: 'activity', vigorous: 'zap', sideway: 'sliders', figure8: 'repeat',
        greeting: 'hand', salute: 'shield', pride: 'target', celebrate: 'play',
        drstrange: 'compass', gunshoot: 'crosshair'
    };

    container.innerHTML = `
        <div class="page-header fade-in">
            <h2>${ic('film')} Patterns & Poses</h2>
            <p>Play movement patterns, record custom poses, and build animation sequences</p>
        </div>

        <div id="pat-now-playing" style="display:none;margin-bottom:16px"></div>

        <div style="margin-bottom:24px">
            <h3 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);margin-bottom:10px">Movement Patterns</h3>
            <div class="grid-auto stagger" id="pat-gallery"></div>
        </div>

        <div class="two-column" style="margin-bottom:24px">
            <div class="card">
                <div class="card-header"><h3>${ic('zap')} Speed</h3></div>
                <input type="range" min="1" max="100" value="50" id="pat-speed">
                <div style="text-align:center;margin-top:6px;color:var(--steel);font-weight:700" id="pat-speed-val">50</div>
            </div>
            <div class="card">
                <div class="card-header"><h3>${ic('sliders')} Amplitude</h3></div>
                <input type="range" min="1" max="100" value="50" id="pat-amplitude">
                <div style="text-align:center;margin-top:6px;color:var(--steel);font-weight:700" id="pat-amp-val">50</div>
            </div>
        </div>

        <div style="margin-bottom:16px">
            <h3 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);margin-bottom:10px">Pose Sequencer</h3>

            <div class="card" style="margin-bottom:12px">
                <div class="card-header">
                    <h3>${ic('grid')} Saved Poses</h3>
                    <button class="btn btn-primary btn-sm" id="pose-save-btn">${ic('camera')} Save Current Pose</button>
                </div>
                <div id="pose-list" style="display:flex;gap:6px;flex-wrap:wrap;min-height:32px">
                    <span style="color:var(--text-muted);font-size:11px">No poses saved. Move servos then click Save.</span>
                </div>
            </div>

            <div class="timeline-container">
                <div class="timeline-header">
                    <h4 style="font-size:12px;font-weight:700;color:var(--text-primary);text-transform:uppercase;letter-spacing:0.5px">Timeline</h4>
                    <span class="badge badge-cream" id="seq-status">Empty</span>
                </div>
                <div class="timeline-track" id="seq-track">
                    <span style="color:var(--text-muted);font-size:11px">Add poses to build a sequence</span>
                </div>
                <div class="timeline-controls">
                    <button class="btn btn-primary btn-sm" id="seq-play-btn">${ic('play')} Play</button>
                    <button class="btn btn-sm" id="seq-stop-btn">${ic('stop')} Stop</button>
                    <button class="btn btn-sm" id="seq-loop-btn">${ic('repeat')} Loop</button>
                    <button class="btn btn-sm" id="seq-clear-btn">${ic('trash')} Clear</button>
                    <div style="flex:1"></div>
                    <div class="input-group" style="flex-direction:row;align-items:center;gap:4px">
                        <label style="font-size:9px;white-space:nowrap">Delay (ms):</label>
                        <input type="number" class="input-field" style="width:70px;padding:5px 6px" value="1000" id="seq-delay">
                    </div>
                </div>
            </div>
        </div>
    `;

    const gallery = document.getElementById('pat-gallery');
    const patterns = State.patterns.length ? State.patterns : [];
    patterns.forEach(pat => {
        const iconName = patternIcons[pat.id] || 'play';
        const card = document.createElement('div');
        card.className = 'pattern-card';
        card.dataset.pattern = pat.id;
        card.innerHTML = `
            <div class="pattern-icon">${ic(iconName)}</div>
            <span class="pattern-name">${pat.name}</span>
            <span class="pattern-hands">${pat.hands} hand${pat.hands === 'both' ? 's' : ''}</span>
        `;
        card.addEventListener('click', () => playPattern(pat, iconName));
        gallery.appendChild(card);
    });

    function playPattern(pat, iconName) {
        const speed = parseInt(document.getElementById('pat-speed').value);
        const amp = parseInt(document.getElementById('pat-amplitude').value);
        socket.emit('start_wave', { pattern: pat.id, speed, amplitude: amp });
        showNowPlaying(pat, iconName);
        document.querySelectorAll('.pattern-card').forEach(c => c.classList.remove('playing'));
        document.querySelector(`.pattern-card[data-pattern="${pat.id}"]`)?.classList.add('playing');
    }

    function showNowPlaying(pat, iconName) {
        const np = document.getElementById('pat-now-playing');
        np.style.display = 'block';
        np.innerHTML = `
            <div class="now-playing">
                <div class="np-icon">${ic(iconName || 'play')}</div>
                <div class="np-info">
                    <div class="np-title">${pat.name}</div>
                    <div class="np-subtitle">Playing — ${pat.hands} hand${pat.hands === 'both' ? 's' : ''}</div>
                </div>
                <div class="np-controls">
                    <button class="btn btn-sm" id="np-stop-btn" style="border-color:rgba(243,195,178,0.2);color:var(--coral)">${ic('stop')} Stop</button>
                </div>
            </div>
        `;
        document.getElementById('np-stop-btn')?.addEventListener('click', () => { socket.emit('stop_wave'); hideNowPlaying(); });
    }

    function hideNowPlaying() {
        document.getElementById('pat-now-playing').style.display = 'none';
        document.querySelectorAll('.pattern-card').forEach(c => c.classList.remove('playing'));
    }

    document.getElementById('pat-speed')?.addEventListener('input', function() { document.getElementById('pat-speed-val').textContent = this.value; });
    document.getElementById('pat-amplitude')?.addEventListener('input', function() { document.getElementById('pat-amp-val').textContent = this.value; });

    // Pose Sequencer
    let sequencePlaying = false, sequenceLoop = false, sequenceTimer = null;

    document.getElementById('pose-save-btn')?.addEventListener('click', () => {
        State.poses.push({ name: `Pose ${State.poses.length + 1}`, servos: { ...State.servos } });
        renderPoseList();
    });

    function renderPoseList() {
        const list = document.getElementById('pose-list');
        list.innerHTML = '';
        if (!State.poses.length) { list.innerHTML = '<span style="color:var(--text-muted);font-size:11px">No poses saved.</span>'; return; }
        State.poses.forEach((pose, i) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm';
            btn.textContent = pose.name;
            btn.addEventListener('click', () => { Object.entries(pose.servos).forEach(([n, a]) => socket.emit('move_servo', { servo: n, angle: a })); });
            list.appendChild(btn);

            const addBtn = document.createElement('button');
            addBtn.className = 'btn btn-sm btn-icon';
            addBtn.innerHTML = ic('plus');
            addBtn.title = 'Add to timeline';
            addBtn.addEventListener('click', () => addToSequence(i));
            list.appendChild(addBtn);
        });
    }

    function addToSequence(poseIndex) {
        State.sequence.push({ poseIndex, durationMs: parseInt(document.getElementById('seq-delay').value) || 1000 });
        renderTimeline();
    }

    function renderTimeline() {
        const track = document.getElementById('seq-track');
        track.innerHTML = '';
        if (!State.sequence.length) {
            track.innerHTML = '<span style="color:var(--text-muted);font-size:11px">Add poses to build a sequence</span>';
            document.getElementById('seq-status').textContent = 'Empty';
            return;
        }
        document.getElementById('seq-status').textContent = `${State.sequence.length} keyframes`;
        State.sequence.forEach((kf, i) => {
            if (i > 0) { const conn = document.createElement('div'); conn.className = 'timeline-connector'; track.appendChild(conn); }
            const frame = document.createElement('div');
            frame.className = 'timeline-keyframe';
            frame.textContent = State.poses[kf.poseIndex]?.name || `P${kf.poseIndex + 1}`;
            frame.title = `${kf.durationMs}ms delay — click to remove`;
            frame.addEventListener('click', () => { State.sequence.splice(i, 1); renderTimeline(); });
            track.appendChild(frame);
        });
    }

    document.getElementById('seq-play-btn')?.addEventListener('click', () => {
        if (!State.sequence.length || sequencePlaying) return;
        sequencePlaying = true;
        document.getElementById('seq-status').textContent = 'Playing';
        document.getElementById('seq-status').className = 'badge badge-steel';
        playStep(0);
    });

    function playStep(index) {
        if (!sequencePlaying || index >= State.sequence.length) {
            if (sequenceLoop && sequencePlaying) { playStep(0); return; }
            stopSequence(); return;
        }
        const kf = State.sequence[index];
        const pose = State.poses[kf.poseIndex];
        if (pose) Object.entries(pose.servos).forEach(([n, a]) => socket.emit('move_servo', { servo: n, angle: a }));
        document.querySelectorAll('.timeline-keyframe').forEach((f, i) => f.classList.toggle('playing', i === index));
        sequenceTimer = setTimeout(() => playStep(index + 1), kf.durationMs);
    }

    function stopSequence() {
        sequencePlaying = false;
        clearTimeout(sequenceTimer);
        document.querySelectorAll('.timeline-keyframe').forEach(f => f.classList.remove('playing'));
        document.getElementById('seq-status').textContent = `${State.sequence.length} keyframes`;
        document.getElementById('seq-status').className = 'badge badge-cream';
    }

    document.getElementById('seq-stop-btn')?.addEventListener('click', stopSequence);
    document.getElementById('seq-loop-btn')?.addEventListener('click', function() {
        sequenceLoop = !sequenceLoop;
        this.style.borderColor = sequenceLoop ? 'var(--steel)' : '';
        this.style.color = sequenceLoop ? 'var(--steel)' : '';
    });
    document.getElementById('seq-clear-btn')?.addEventListener('click', () => { stopSequence(); State.sequence = []; renderTimeline(); });

    const onStatus = (data) => { if (data.wave && !data.wave.active) hideNowPlaying(); };
    State.on('status', onStatus);

    renderPoseList();
    renderTimeline();

    if (State.wave.active) {
        const pat = patterns.find(p => p.id === State.wave.pattern);
        if (pat) showNowPlaying(pat, patternIcons[pat.id]);
    }

    container._cleanup = () => { State.off('status', onStatus); stopSequence(); };
};
