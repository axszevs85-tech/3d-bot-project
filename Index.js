const THREE = require('three');
const gl = require('gl')(500, 500);
const { createCanvas } = require('canvas');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Telegram bot tokeningizni shu yerga qo'ying
const token = 8678906803:AAGR6HNm5ikhySxn-8vG40TlB4LUWk7OScU
const bot = new TelegramBot(token, {polling: true});

// 3D render funksiyasi
function render3D() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ context: gl });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 2;
    renderer.setSize(500, 500);
    renderer.render(scene, camera);

    const pixels = new Uint8Array(500 * 500 * 4);
    gl.readPixels(0, 0, 500, 500, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(500, 500);
    imgData.data.set(pixels);
    ctx.putImageData(imgData, 0, 0);

    const out = fs.createWriteStream('output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    return 'output.png';
}

// Telegram bot komandalari
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Salom! 3D rasm olish uchun /render deb yozing.");
});

bot.onText(/\/render/, async (msg) => {
    bot.sendMessage(msg.chat.id, "3D model render qilinmoqda, kuting...");
    const imagePath = render3D();
    
    // Rasm tayyor bo'lishini kutish uchun kichik pauza
    setTimeout(() => {
        bot.sendPhoto(msg.chat.id, imagePath);
    }, 1000);
});
