/**
 * Interactive SVG Body Visualization
 *
 * Renders an upper-body InMoov silhouette with clickable joints.
 * Joints glow based on activity, click to select.
 *
 * createSVGBody(options) → HTMLElement
 *   options: {
 *       onJointClick: fn(servoName),
 *       width:  '100%',
 *       height: '500px'
 *   }
 */
window.createSVGBody = function(options = {}) {
    const container = document.createElement('div');
    container.className = 'svg-body-container';

    const w = 320;
    const h = 500;

    // Joint positions (x, y) on the SVG canvas
    const joints = {
        // Right arm (viewer's left = robot's right)
        r_shoulder:  { x: 105, y: 120, label: 'R.Shoulder' },
        r_omoplate:  { x: 90,  y: 100, label: 'R.Omoplate' },
        r_bicep:     { x: 80,  y: 200, label: 'R.Bicep' },
        r_rotate:    { x: 75,  y: 280, label: 'R.Rotate' },
        // Right hand
        r_wrist:     { x: 70,  y: 330, label: 'R.Wrist' },
        r_thumb:     { x: 50,  y: 360, label: 'R.Thumb' },
        r_index:     { x: 58,  y: 375, label: 'R.Index' },
        r_middle:    { x: 66,  y: 380, label: 'R.Middle' },
        r_ring:      { x: 74,  y: 378, label: 'R.Ring' },
        r_pinky:     { x: 82,  y: 372, label: 'R.Pinky' },
        // Left arm (viewer's right = robot's left)
        l_shoulder:  { x: 215, y: 120, label: 'L.Shoulder' },
        l_omoplate:  { x: 230, y: 100, label: 'L.Omoplate' },
        l_bicep:     { x: 240, y: 200, label: 'L.Bicep' },
        l_rotate:    { x: 245, y: 280, label: 'L.Rotate' },
        // Left hand
        l_wrist:     { x: 250, y: 330, label: 'L.Wrist' },
        l_thumb:     { x: 270, y: 360, label: 'L.Thumb' },
        l_index:     { x: 262, y: 375, label: 'L.Index' },
        l_middle:    { x: 254, y: 380, label: 'L.Middle' },
        l_ring:      { x: 246, y: 378, label: 'L.Ring' },
        l_pinky:     { x: 238, y: 372, label: 'L.Pinky' },
    };

    // Limb connections (pairs of joints to draw lines between)
    const limbs = [
        // Right arm
        { from: [160, 90], to: [105, 120], side: 'right' },   // torso → r_shoulder
        { from: [105, 120], to: [80, 200], side: 'right' },   // shoulder → bicep
        { from: [80, 200],  to: [75, 280], side: 'right' },   // bicep → rotate
        { from: [75, 280],  to: [70, 330], side: 'right' },   // rotate → wrist
        // Right hand fingers
        { from: [70, 330], to: [50, 360], side: 'right' },
        { from: [70, 330], to: [58, 375], side: 'right' },
        { from: [70, 330], to: [66, 380], side: 'right' },
        { from: [70, 330], to: [74, 378], side: 'right' },
        { from: [70, 330], to: [82, 372], side: 'right' },
        // Left arm
        { from: [160, 90], to: [215, 120], side: 'left' },
        { from: [215, 120], to: [240, 200], side: 'left' },
        { from: [240, 200], to: [245, 280], side: 'left' },
        { from: [245, 280], to: [250, 330], side: 'left' },
        // Left hand fingers
        { from: [250, 330], to: [270, 360], side: 'left' },
        { from: [250, 330], to: [262, 375], side: 'left' },
        { from: [250, 330], to: [254, 380], side: 'left' },
        { from: [250, 330], to: [246, 378], side: 'left' },
        { from: [250, 330], to: [238, 372], side: 'left' },
    ];

    let svgContent = `
        <svg viewBox="0 0 ${w} ${h}" width="100%" style="max-height:${options.height || '500px'}">
            <defs>
                <radialGradient id="headGrad" cx="50%" cy="40%">
                    <stop offset="0%" stop-color="rgba(218,235,227,0.12)"/>
                    <stop offset="100%" stop-color="rgba(218,235,227,0.03)"/>
                </radialGradient>
            </defs>

            <!-- Head -->
            <ellipse cx="160" cy="45" rx="30" ry="35" fill="url(#headGrad)" stroke="rgba(207,214,196,0.2)" stroke-width="1.5"/>
            <!-- Eyes -->
            <circle cx="150" cy="40" r="3" fill="rgba(153, 205, 216, 0.7)"/>
            <circle cx="170" cy="40" r="3" fill="rgba(153, 205, 216, 0.7)"/>
            <!-- Neck -->
            <line x1="160" y1="80" x2="160" y2="90" stroke="rgba(207,214,196,0.15)" stroke-width="4" stroke-linecap="round"/>

            <!-- Torso -->
            <path d="M 120 90 Q 160 85 200 90 L 195 220 Q 160 225 125 220 Z"
                  fill="rgba(207,214,196,0.05)" stroke="rgba(207,214,196,0.15)" stroke-width="1.5"/>
    `;

    // Draw limb lines
    limbs.forEach(limb => {
        svgContent += `
            <line class="limb-line ${limb.side}"
                  x1="${limb.from[0]}" y1="${limb.from[1]}"
                  x2="${limb.to[0]}" y2="${limb.to[1]}"/>
        `;
    });

    // Draw joint circles
    Object.entries(joints).forEach(([name, pos]) => {
        const r = name.includes('thumb') || name.includes('index') || name.includes('middle') ||
                  name.includes('ring') || name.includes('pinky') ? 5 : 8;
        svgContent += `
            <circle class="joint-circle" data-joint="${name}"
                    cx="${pos.x}" cy="${pos.y}" r="${r}">
                <title>${pos.label}</title>
            </circle>
        `;
    });

    svgContent += '</svg>';
    container.innerHTML = svgContent;

    // Click handler
    container.querySelectorAll('.joint-circle').forEach(circle => {
        circle.addEventListener('click', () => {
            // Deselect others
            container.querySelectorAll('.joint-circle').forEach(c => c.classList.remove('active'));
            circle.classList.add('active');
            const name = circle.dataset.joint;
            window.AppState.selectedJoint = name;
            if (options.onJointClick) options.onJointClick(name);
        });
    });

    // Public: highlight a joint
    container.highlightJoint = function(name) {
        container.querySelectorAll('.joint-circle').forEach(c => {
            c.classList.toggle('active', c.dataset.joint === name);
        });
    };

    return container;
};
