document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
    }

    // Initialize PIXI.js background
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
        autoDensity: true,
        powerPreference: "high-performance"
    });

    document.body.insertBefore(app.view, document.body.firstChild);
    app.view.style.position = 'fixed';
    app.view.style.top = '0';
    app.view.style.left = '0';
    app.view.style.zIndex = '-1';

    // Create grain texture with more intensity
    const grainTexture = new PIXI.filters.NoiseFilter();
    grainTexture.noise = 0.01;
    grainTexture.seed = Math.random();

    // Track mouse position
    let mouseX = app.screen.width / 2;
    let mouseY = app.screen.height / 2;
    app.view.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Create blobs
    const blobs = Array(5).fill().map(() => {
        const blob = new PIXI.Graphics();
        const baseSize = Math.random() * 200 + 150;
        
        blob.baseSize = baseSize;
        blob.currentSize = baseSize;
        blob.sizeSpeed = (Math.random() * 1 + 0.5) * 0.02;
        blob.sizeDirection = 1;
        
        // Deeper blue color with higher opacity
        const r = 0;
        const g = 0;
        const b = 170;
        const color = (r * 65536) + (g * 256) + b;
        blob.beginFill(color, 0.25);
        
        // Draw shape with bezier curves for smoother corners
        blob.moveTo(baseSize, 0);
        const points = [];
        const numPoints = 8;
        
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radius = baseSize * (0.8 + Math.random() * 0.4);
            points.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        
        // Draw smooth curve through points
        blob.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const nextPoint = points[(i + 1) % points.length];
            const controlPoint = {
                x: (point.x + nextPoint.x) / 2,
                y: (point.y + nextPoint.y) / 2
            };
            blob.quadraticCurveTo(point.x, point.y, controlPoint.x, controlPoint.y);
        }
        
        blob.endFill();
        
        // Combine blur and grain filters
        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 60;
        blob.filters = [blurFilter, grainTexture];
        
        // Position and speed
        blob.x = Math.random() * app.screen.width;
        blob.y = Math.random() * app.screen.height;
        blob.speed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            rotation: Math.random() * Math.PI * 2,
            waveSpeed: Math.random() * 0.0002 + 0.0001,
            waveAmplitude: Math.random() * 15 + 5
        };
        
        app.stage.addChild(blob);
        return blob;
    });

    // Animation
    app.ticker.add((delta) => {
        grainTexture.seed = Math.random();
        
        blobs.forEach(blob => {
            // Simple, consistent directional movement
            blob.x += blob.speed.x * delta;
            blob.y += blob.speed.y * delta;
            
            // Very subtle wave effect for slight vertical variation
            const time = Date.now() * 0.001;
            blob.y += Math.sin(time * blob.speed.waveSpeed) * blob.speed.waveAmplitude * 0.001 * delta;

            // Extremely soft edge bouncing
            const padding = blob.currentSize;
            if (blob.x < padding || blob.x > app.screen.width - padding) {
                blob.speed.x *= -0.3;
            }
            if (blob.y < padding || blob.y > app.screen.height - padding) {
                blob.speed.y *= -0.3;
            }

            // Keep speed very limited
            const maxSpeed = 0.5;
            const currentSpeed = Math.sqrt(blob.speed.x * blob.speed.x + blob.speed.y * blob.speed.y);
            if (currentSpeed > maxSpeed) {
                blob.speed.x = (blob.speed.x / currentSpeed) * maxSpeed;
                blob.speed.y = (blob.speed.y / currentSpeed) * maxSpeed;
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        // Fade out animation
        document.querySelector('.dashboard-container').style.opacity = '0';
        document.querySelector('.dashboard-container').style.transform = 'translateY(20px)';
        
        await new Promise(resolve => setTimeout(resolve, 400));
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'index.html';
    });
}); 