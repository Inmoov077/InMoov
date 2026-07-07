/**
 * Sidebar component — manages collapse state and connection actions.
 * Mostly handled in CSS + app.js; this adds the connect/disconnect logic.
 */
(function() {
    // Auto-wire sidebar connection indicator click
    document.addEventListener('DOMContentLoaded', () => {
        const indicator = document.getElementById('connection-status');
        if (indicator) {
            indicator.style.cursor = 'pointer';
            indicator.addEventListener('click', () => {
                if (window.AppState.connected) {
                    window.AppSocket.emit('disconnect_arduino');
                } else {
                    window.AppSocket.emit('connect_arduino');
                }
            });
        }
    });
})();
