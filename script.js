// Cursor Class for smoothing hand movements
class Cursor {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.smoothing = 0.2;
    }
    update(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
        // Smooth movement
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
        return { x: this.x, y: this.y };
    }
}

// TV Interactive System with Hand Gesture Control
class TVSystem {
    constructor() {
        // DOM Elements
        this.cameraFeed = document.getElementById('cameraFeed');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.iframePlayer = document.getElementById('iframePlayer');
        this.handCanvas = document.getElementById('handCanvas');
        this.statusOverlay = document.getElementById('statusOverlay');
        this.statusText = document.getElementById('statusText');
        this.channelNumber = document.getElementById('channelNumber');
        this.gestureIndicator = document.getElementById('gestureIndicator');
        this.channelGrid = document.getElementById('channelGrid');
        this.powerBtn = document.getElementById('powerBtn');
        // New UI Elements
        this.videoControls = document.getElementById('videoControls');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressFilled = document.querySelector('.progress-filled');
        this.progressContainer = document.querySelector('.progress-container');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.gestureCursor = document.getElementById('gestureCursor');
        this.iconPlay = document.querySelector('.icon-play');
        this.iconPause = document.querySelector('.icon-pause');
        // Canvas context
        this.canvasCtx = this.handCanvas.getContext('2d');
        // State
        this.currentChannel = 0;
        this.isPinching = false;
        this.lastPinchTime = 0;
        this.pinchCooldown = 1000;
        this.tvOn = false;
        this.cursor = new Cursor();
        this.isDragging = false;
        this.controlsTimeout = null;
        this.lastGestureTime = 0;
        // Gesture recognizer (global class from gestureRecognizer.js)
        this.gestureRecognizer = new GestureRecognizer();
        // Channels
        this.channels = [
            { name: "Canal da Câmera", description: "Visualização ao vivo da câmera", type: "camera" },
            { name: "Naruto Shippuden OP 16", description: "Silhouette - KANA-BOON", type: "iframe", url: "https://www.youtube.com/embed/k626C7256V4?autoplay=1&mute=0" },
            { name: "Attack on Titan OP 7", description: "The Rumbling - SiM (Creditless)", type: "iframe", url: "https://www.youtube.com/embed/0P7nCslcaQ0?autoplay=1&mute=0" },
            { name: "Chainsaw Man OP 1", description: "KICK BACK - Kenshi Yonezu", type: "iframe", url: "https://www.youtube.com/embed/MvezH6085_k?autoplay=1&mute=0" },
            { name: "Jujutsu Kaisen OP 1", description: "Kaikai Kitan - Eve (Creditless)", type: "iframe", url: "https://www.youtube.com/embed/19Y1374ave0?autoplay=1&mute=0" },
            { name: "Black Clover OP 10", description: "Black Catcher - Vickeblanka", type: "iframe", url: "https://www.youtube.com/embed/o-Yd-q9s1t8?autoplay=1&mute=0" },
            { name: "Demon Slayer OP 1", description: "Gurenge - LiSA", type: "iframe", url: "https://www.youtube.com/embed/4DxL6IKmDx4?autoplay=1&mute=0" },
            { name: "One Piece OP 1", description: "We Are! - Hiroshi Kitadani (Clássico)", type: "iframe", url: "https://www.youtube.com/embed/1Mc6aZ7H4fE?autoplay=1&mute=0" }
        ];
        this.init();
    }

    async init() {
        this.renderChannelList();
        this.setupEventListeners();
        this.setupVideoControls();
        await this.setupCamera();
        await this.setupHandDetection();
    }

    setupEventListeners() {
        this.powerBtn.addEventListener('click', () => this.togglePower());
        this.channelGrid.addEventListener('click', (e) => {
            const channelItem = e.target.closest('.channel-item');
            if (channelItem) {
                const channelIndex = parseInt(channelItem.dataset.channel);
                this.switchChannel(channelIndex);
            }
        });
    }

    renderChannelList() {
        this.channelGrid.innerHTML = '';
        this.channels.forEach((channel, index) => {
            const channelItem = document.createElement('div');
            channelItem.className = 'channel-item';
            channelItem.dataset.channel = index;
            if (index === this.currentChannel) {
                channelItem.classList.add('active');
            }
            channelItem.innerHTML = `
                <div class="channel-number">Canal ${index + 1}</div>
                <div class="channel-name">${channel.name}</div>
                <div class="channel-description">${channel.description}</div>
            `;
            this.channelGrid.appendChild(channelItem);
        });
    }

    setupVideoControls() {
        // Play/Pause
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        // Progress Bar
        this.videoPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.videoPlayer.addEventListener('loadedmetadata', () => {
            this.totalTimeEl.textContent = this.formatTime(this.videoPlayer.duration);
        });
        // Click on progress bar to seek
        this.progressContainer.addEventListener('click', (e) => {
            const rect = this.progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.videoPlayer.currentTime = pos * this.videoPlayer.duration;
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateProgress() {
        if (this.isDragging) return;
        const percent = (this.videoPlayer.currentTime / this.videoPlayer.duration) * 100;
        this.progressFilled.style.width = `${percent}%`;
        this.currentTimeEl.textContent = this.formatTime(this.videoPlayer.currentTime);
    }

    togglePlayPause() {
        if (this.videoPlayer.paused) {
            this.videoPlayer.play();
            this.iconPlay.classList.add('hidden');
            this.iconPause.classList.remove('hidden');
        } else {
            this.videoPlayer.pause();
            this.iconPlay.classList.remove('hidden');
            this.iconPause.classList.add('hidden');
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.videoPlayer.parentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    showControls() {
        this.videoControls.classList.add('active');
        this.gestureCursor.classList.remove('hidden');
        if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
        this.controlsTimeout = setTimeout(() => {
            if (!this.isDragging) {
                this.videoControls.classList.remove('active');
                this.gestureCursor.classList.add('hidden');
            }
        }, 3000);
    }

    async setupCamera() {
        try {
            this.statusText.textContent = 'Acessando câmera...';
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                audio: false
            });
            this.cameraFeed.srcObject = stream;
            await new Promise((resolve) => {
                this.cameraFeed.onloadedmetadata = () => {
                    this.cameraFeed.play();
                    resolve();
                };
            });
            this.statusText.textContent = 'Câmera ativada! Iniciando detecção de gestos...';
        } catch (error) {
            console.error('Erro ao acessar câmera:', error);
            this.statusText.textContent = 'Erro ao acessar câmera. Verifique permissões.';
            alert('Erro ao acessar a câmera. Por favor, verifique se a câmera está conectada e se você deu permissão de acesso.');
        }
    }

    async setupHandDetection() {
        try {
            const hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });
            // Enable 2 hands for combination gestures
            hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });
            hands.onResults((results) => this.onHandResults(results));
            this.startDetectionLoop(hands);
            this.statusText.textContent = 'Sistema pronto! Use gestos para controlar.';
            setTimeout(() => { this.statusOverlay.classList.add('hidden'); this.tvOn = true; }, 2000);
        } catch (error) {
            console.error('Erro ao inicializar detecção de mãos:', error);
            this.statusText.textContent = 'Erro ao carregar detecção de gestos.';
        }
    }

    startDetectionLoop(hands) {
        const detect = async () => {
            if (this.cameraFeed.videoWidth > 0 && this.cameraFeed.videoHeight > 0) {
                await hands.send({ image: this.cameraFeed });
            }
            requestAnimationFrame(detect);
        };
        detect();
    }

    onHandResults(results) {
        this.handCanvas.width = this.cameraFeed.videoWidth;
        this.handCanvas.height = this.cameraFeed.videoHeight;
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.handCanvas.width, this.handCanvas.height);

        const allLandmarks = results.multiHandLandmarks || [];

        if (allLandmarks.length > 0) {
            // Draw all hands
            allLandmarks.forEach(landmarks => this.drawHand(landmarks));

            if (this.tvOn) {
                // Update cursor with the first hand detected (primary hand)
                this.updateCursor(allLandmarks[0]);

                // 1. Detect Multi-Hand Combinations
                if (allLandmarks.length === 2) {
                    const gesture1 = this.gestureRecognizer.identifyGesture(allLandmarks[0]);
                    const gesture2 = this.gestureRecognizer.identifyGesture(allLandmarks[1]);

                    if (gesture1 === 'PEACE_SIGN' && gesture2 === 'PEACE_SIGN') {
                        // Double Peace Sign detected!
                        const now = Date.now();
                        if (now - this.lastGestureTime > 2000) {
                            document.body.classList.toggle('dark-mode');
                            this.showFeedback('🌙 Modo Noturno');
                            this.lastGestureTime = now;
                            this.canvasCtx.restore();
                            return; // Stop further processing
                        }
                    } else {
                        // Debug: Show what is being detected if 2 hands are present
                        const now = Date.now();
                        if (now - this.lastGestureTime > 2000) {
                            // Uncomment to see debug on screen
                            // this.showFeedback(`H1: ${gesture1 || '?'} | H2: ${gesture2 || '?'}`);
                        }
                    }
                }

                // 2. Single Hand Gestures (Primary Hand)
                // Use the first hand for cursor/single commands to avoid conflict
                this.detectGestures(allLandmarks[0]);
                this.showControls();
            }
        } else {
            this.gestureCursor.classList.add('hidden');
            if (this.isPinching) {
                this.isPinching = false;
                this.isDragging = false;
                this.gestureIndicator.classList.add('hidden');
                this.gestureCursor.classList.remove('clicking', 'dragging');
            }
        }
        this.canvasCtx.restore();
    }

    updateCursor(landmarks) {
        const indexTip = landmarks[8];
        const targetX = (1 - indexTip.x) * window.innerWidth;
        const targetY = indexTip.y * window.innerHeight;
        const pos = this.cursor.update(targetX, targetY);
        this.gestureCursor.style.left = `${pos.x}px`;
        this.gestureCursor.style.top = `${pos.y}px`;
    }

    // Gesture detection using GestureRecognizer
    detectGestures(landmarks) {
        const gesture = this.gestureRecognizer.detect(landmarks);

        // Always check for stop drag if currently dragging
        if (this.isDragging && gesture === 'OPEN_HAND') {
            this.stopSmartDrag();
            return;
        }

        // Logic for mapping hand position to video time when dragging
        if (this.isDragging) {
            this.updateSmartDrag(landmarks);
            return; // Don't process other gestures while dragging
        }

        if (!gesture) return;

        switch (gesture) {
            case 'THUMBS_UP':
                this.switchChannel((this.currentChannel + 1) % this.channels.length);
                this.showFeedback('👍 Próximo Canal');
                break;
            case 'THUMBS_DOWN':
                this.switchChannel((this.currentChannel - 1 + this.channels.length) % this.channels.length);
                this.showFeedback('👎 Canal Anterior');
                break;
            case 'PEACE_SIGN':
                if (this.channels[this.currentChannel].type === 'video') {
                    this.togglePlayPause();
                    this.showFeedback(this.videoPlayer.paused ? '⏸ Pause' : '▶ Play');
                }
                break;
            case 'OPEN_HAND':
                // Neutral
                break;
            case 'FIST':
                // Trigger Drag start
                if (this.channels[this.currentChannel].type === 'video') {
                    this.startSmartDrag();
                }
                break;
            case 'V_THUMB':
                document.body.classList.toggle('dark-mode');
                this.showFeedback('🌙 Modo Noturno');
                break;
        }
    }

    startSmartDrag() {
        if (this.isDragging) return;
        this.isDragging = true;
        this.gestureCursor.classList.add('dragging');
        this.gestureCursor.style.backgroundColor = 'rgba(255, 165, 0, 0.8)'; // Orange for drag
        this.showFeedback('✊ Arrastando...');
    }

    stopSmartDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.gestureCursor.classList.remove('dragging');
        this.gestureCursor.style.backgroundColor = ''; // Reset
        this.showFeedback('🖐 Soltou');
    }

    updateSmartDrag(landmarks) {
        if (!this.isDragging) return;

        // Use Index Finger Tip x-coordinate directly
        // landmarks[8].x is normalized 0.0 to 1.0 (0=left, 1=right)
        // Camera is mirrored, so 1-x is the visual screen x
        const handX = 1 - landmarks[8].x;

        // Map 0.1 to 0.9 to 0-100% video duration (giving some edge buffer)
        let pos = (handX - 0.1) / 0.8;
        pos = Math.max(0, Math.min(1, pos));

        if (this.videoPlayer.duration) {
            this.videoPlayer.currentTime = pos * this.videoPlayer.duration;
            this.progressFilled.style.width = `${pos * 100}%`;
        }
    }

    handlePinchStart() {
        // Keeping legacy pinch for button clicks only
        const cursorRect = this.gestureCursor.getBoundingClientRect();
        const cursorX = cursorRect.left + cursorRect.width / 2;
        const cursorY = cursorRect.top + cursorRect.height / 2;
        const playBtnRect = this.playPauseBtn.getBoundingClientRect();
        const fullscreenBtnRect = this.fullscreenBtn.getBoundingClientRect();

        if (this.isOverElement(cursorX, cursorY, playBtnRect)) {
            this.togglePlayPause();
        } else if (this.isOverElement(cursorX, cursorY, fullscreenBtnRect)) {
            this.toggleFullscreen();
        }
    }

    handleDrag() {
        // Deprecated/Unused legacy pinch drag
    }

    handlePinchEnd() {
        // Deprecated/Unused legacy pinch drag
    }

    isOverElement(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    showFeedback(text) {
        const indicator = document.createElement('div');
        indicator.className = 'gesture-indicator';
        indicator.style.position = 'fixed';
        indicator.style.top = '50%';
        indicator.style.left = '50%';
        indicator.style.transform = 'translate(-50%, -50%)';
        indicator.innerHTML = `<span>${text}</span>`;
        document.body.appendChild(indicator);
        setTimeout(() => indicator.remove(), 1000);
    }

    switchChannel(channelIndex) {
        if (!this.tvOn) return;
        this.currentChannel = channelIndex;
        this.channelNumber.textContent = channelIndex + 1;
        const channel = this.channels[channelIndex];
        this.cameraFeed.classList.add('hidden');
        this.videoPlayer.classList.add('hidden');
        this.iframePlayer.classList.add('hidden');
        this.videoControls.classList.add('hidden');
        this.videoPlayer.pause();
        this.iframePlayer.src = '';
        if (channel.type === 'camera') {
            this.cameraFeed.classList.remove('hidden');
        } else if (channel.type === 'video') {
            this.videoPlayer.classList.remove('hidden');
            this.videoPlayer.src = channel.url;
            this.videoPlayer.play().catch(err => { console.error('Erro ao reproduzir vídeo:', err); this.switchChannel(0); });
        } else if (channel.type === 'iframe') {
            this.iframePlayer.classList.remove('hidden');
            this.iframePlayer.src = channel.url;
        }
        this.renderChannelList();
        this.channelNumber.style.transform = 'scale(1.2)';
        setTimeout(() => this.channelNumber.style.transform = 'scale(1)', 200);
    }

    togglePower() {
        this.tvOn = !this.tvOn;
        if (this.tvOn) {
            this.statusOverlay.classList.add('hidden');
            this.powerBtn.style.background = 'linear-gradient(145deg, #667eea, #764ba2)';
        } else {
            this.statusOverlay.classList.remove('hidden');
            this.statusText.textContent = 'TV Desligada';
            this.powerBtn.style.background = 'linear-gradient(145deg, #2d3748, #1a202c)';
            this.videoPlayer.pause();
            this.iframePlayer.src = '';
        }
    }

    drawHand(landmarks) {
        const connections = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]];
        this.canvasCtx.strokeStyle = '#667eea';
        this.canvasCtx.lineWidth = 3;
        connections.forEach(([start, end]) => {
            const sp = landmarks[start];
            const ep = landmarks[end];
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(sp.x * this.handCanvas.width, sp.y * this.handCanvas.height);
            this.canvasCtx.lineTo(ep.x * this.handCanvas.width, ep.y * this.handCanvas.height);
            this.canvasCtx.stroke();
        });
        landmarks.forEach(l => {
            this.canvasCtx.fillStyle = '#764ba2';
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(l.x * this.handCanvas.width, l.y * this.handCanvas.height, 5, 0, 2 * Math.PI);
            this.canvasCtx.fill();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tvSystem = new TVSystem();
});
