const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let multiplier = 1.0;
let isFlying = false;
let crashPoint = 1;
let animationId;
let planeX = 0;
let planeY = 350;

// ڈبل بیٹنگ اور آٹو فیچرز کا لاجک یہاں آئے گا
function startFlight() {
    isFlying = true;
    multiplier = 1.0;
    planeX = 0;
    planeY = 350;
    crashPoint = (Math.random() * 4 + 1.2).toFixed(2);
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // پس منظر اور جہاز کی ڈرائنگ
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.fillText(multiplier.toFixed(2) + 'x', 200, 150);

    ctx.fillStyle = 'red';
    ctx.fillRect(planeX, planeY, 50, 30);

    if (isFlying) {
        multiplier += 0.03;
        planeX += 3;
        planeY -= 2;

        if (multiplier >= crashPoint) {
            isFlying = false;
            ctx.fillStyle = 'red';
            ctx.fillText('CRASHED', 150, 250);
        } else {
            animationId = requestAnimationFrame(animate);
        }
    }
}
