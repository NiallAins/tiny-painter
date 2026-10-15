let
    can = document.getElementById('can'),
    ctx = can.getContext('2d'),
    curCan = document.getElementById('cursorCan'),
    curCtx = curCan.getContext('2d'),
    body = document.body,
    main = document.getElementById('main'),
    aside = document.getElementById('aside'),
    pallette = document.getElementById('pallette'),
    sizer = document.getElementById('sizer');
can.width = 100;
can.height = 50;
ctx.translate(0.5, 0.5);
curCan.width = 100;
curCan.height = 50;
ctx.translate(0.5, 0.5);
curCtx.fillStyle = '#fff';
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.fillStyle = '#fff';
ctx.fillRect(-1, -1, 101, 51);

// Mouse listener
let mouse = {
    active: false,
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    press : false,
    down: false,
    up: false
};
body.onmousemove = e => {
    mouse.x = e.clientX - main.offsetLeft;
    mouse.y = e.clientY - main.offsetTop;
};
body.onmousedown = e => {
    mouse.down = true;
    mouse.press = true;
    mouse.x = e.clientX - main.offsetLeft;
    mouse.y = e.clientY - main.offsetTop;
    mouse.prevX = mouse.x + 1;
    mouse.prevY = mouse.y;
};
body.onmouseup = () => {
    mouse.up = true;
    mouse.press = false;
};
body.onmouseleave = () => {
    mouse.up = true;
    mouse.press = false;
    mouse.active = false;
};
body.onmouseenter = () => {
    mouse.active = true;
};
body.ontouchstart = e => {
    mouse.active = true;
    body.onmousedown(e.touches[0]);
}
body.ontouchmove = e => {
    body.onmousemove(e.touches[0]);
}
body.ontouchend = () => {
    mouse.active = false;
    body.onmouseup();
}

[
 'white', 'lightgray', 'gray', 'black',
 'pink', 'purple', 'yellow', 'lightgreen', 'lightblue',
 'red', 'brown', 'orange', 'green', 'blue'
].forEach(c => {
    let col = document.createElement('div');
    col.style.background = c;
    col.onclick = () => {
        ctx.strokeStyle = c;
        main.classList.remove('overlay-colors', 'overlay-tools');
    };
    pallette.appendChild(col);
});

[1, 3, 8, 13, 20].forEach(s => {
    let size = document.createElement('div'),
            icon = document.createElement('div');
    icon.style.width = s + 'px';
    icon.style.height = s + 'px';
    size.onclick = () => {
        ctx.lineWidth = s;
        main.classList.remove('overlay-size', 'overlay-tools');
    };
    sizer.appendChild(size);
    size.appendChild(icon);
});


function step() {
    if (mouse.press && !main.classList.contains('overlay-tools')) {
        ctx.beginPath();
            ctx.moveTo(mouse.prevX, mouse.prevY);
            ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
    }
    if (window.matchMedia("(any-hover: hover)").matches) {
        drawCursor();
    }
    mouse.up = false;
    mouse.down = false;
    window.requestAnimationFrame(step);
}

function drawCursor() {
    curCtx.clearRect(-1, -1, 101, 51);
    if (mouse.active) {
        curCtx.beginPath();
            curCtx.moveTo(mouse.x, mouse.y);
            curCtx.lineTo(mouse.x + 3, mouse.y);
            curCtx.lineTo(mouse.x + 9, mouse.y + 6);
            curCtx.lineTo(mouse.x + 6, mouse.y + 9);
            curCtx.lineTo(mouse.x, mouse.y + 3);
        curCtx.closePath();
        curCtx.fill();
        curCtx.stroke();
    }
}
step();

function clearImage() {
    ctx.fillRect(-1, -1, 101, 51);
    main.classList.remove('overlay-tools');
}

function saveImage() {
    let imgContain = document.createElement('div');
    let img = document.createElement('img');
    let imgUrl = can.toDataURL("image/png").replace("image/png", "image/octet-stream");
    img.src = imgUrl
    img.classList.add('hide');
    imgContain.appendChild(img);
    
    let btnDel = document.createElement('button');
    btnDel.classList.add('delete');
    btnDel.onclick = () => aside.removeChild(imgContain);
    imgContain.appendChild(btnDel);
    
    let btnCopy = document.createElement('button');
    btnCopy.classList.add('copy');
    btnCopy.onclick = () => {
        ctx.drawImage(img, -0.5, -0.5);
        main.classList.remove('overlay-tools');
    }
    imgContain.appendChild(btnCopy);
    
    let btnDown = document.createElement('button');
    btnDown.classList.add('download');
    btnDown.onclick = () => window.location.href = imgUrl;
    imgContain.appendChild(btnDown);
    
    aside.appendChild(imgContain);
    setTimeout(() => img.classList.remove('hide'), 100);
    clearImage();
}

function pickColor(col) {
    ctx.strokeStyle = col;
    main.classList.remove('overlay-colors', 'overlay-tools')
}