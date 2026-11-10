const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const betBtn = document.getElementById('betBtn');
const cashoutBtn = document.getElementById('cashoutBtn');

let multiplier = 1.0;
let isFlying = false;
let crashPoint = 1;
let animationId;
let planeX = 0;
let planeY = 300;

betBtn.addEventListener('click', () => {
    isFlying = false;
    multiplier = 1.0;
    planeX = 0;
    planeY = 300;
    crashPoint = (Math.random() * 5 + 1.1).toFixed(2);
    isFlying = true;
    betBtn.disabled = true;
    cashoutBtn.disabled = false;
    animate();
});

cashoutBtn.addEventListener('click', () => {
    if (isFlying) {
        isFlying = false;
        cancelAnimationFrame(animationId);
        alert('آپ نے ' + multiplier.toFixed(2) + 'x پر کیش آؤٹ کر لیا!');
        betBtn.disabled = false;
        cashoutBtn.disabled = true;
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw multiplier
    ctx.fillStyle = 'white';
    ctx.font = 'bold 50px Arial';
    ctx.fillText(multiplier.toFixed(2) + 'x', 50, 100);

    // Draw plane
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(planeX, planeY, 40, 25);

    if (isFlying) {
        multiplier += 0.02;
        planeX += 2;
        planeY -= 1.5;

        if (multiplier >= crashPoint) {
            isFlying = false;
            ctx.fillStyle = '#FF4136';
            ctx.font = 'bold 60px Arial';
            ctx.fillText('CRASHED', 150, 220);
            betBtn.disabled = false;
            cashoutBtn.disabled = true;
        } else {
            animationId = requestAnimationFrame(animate);
        }
    }
}
