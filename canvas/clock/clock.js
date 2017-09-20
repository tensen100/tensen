const WIDTH = 1024; // 画布宽度
const Height = 400; //画布高度
const RADIUS = 8; // 圆形半径
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]; //小球颜色
let currentTime = {};// 当前时间
const OFFSET_LEFT = 10;
const OFFSET_TOP = 50;
let balls =[]; // 储存小球

window.onload = function () {

    let date = new Date();
    currentTime.hours = date.getHours(); //小时
    currentTime.minutes = date.getMinutes(); //分钟
    currentTime.seconds = date.getSeconds(); //秒
    let canvas = document.getElementById("canvas");
    canvas.width = WIDTH;
    canvas.height = Height;
    if(canvas.getContext){
        let ctx = canvas.getContext("2d");
        setInterval(function () {
            render(ctx);
            update();
        },50)
    }
};

// 更新数据
function update() {
    let date = new Date();
    if (date.getSeconds() !== currentTime.seconds){
        let s = date.getSeconds();
        let cs = currentTime.seconds;
        if( parseInt(s/10) !== parseInt(cs/10) ){
            addBalls(OFFSET_LEFT + 78 * (RADIUS + 1), OFFSET_TOP ,parseInt(s/10))
        }
        if( parseInt(s%10) !== parseInt(cs%10) ){
            addBalls(OFFSET_LEFT + 93 * (RADIUS + 1), OFFSET_TOP ,parseInt(s/10))
        }
        currentTime.seconds = date.getSeconds();
    }
    if (date.getMinutes() !== currentTime.minutes){
        let m = date.getMinutes();
        let cm = currentTime.minutes;
        if( parseInt(m/10) !== parseInt(cm/10) ){
            addBalls(OFFSET_LEFT + 39 * (RADIUS + 1), OFFSET_TOP ,parseInt(m/10))
        }
        if( parseInt(m%10) !== parseInt(cm%10) ){
            addBalls(OFFSET_LEFT + 54 * (RADIUS + 1), OFFSET_TOP ,parseInt(m%10))
        }
        currentTime.minutes = date.getMinutes();
    }
    if (date.getHours() !== currentTime.hours){
        let h = date.getHours();
        let ch = currentTime.seconds;
        if( parseInt(h/10) !== parseInt(ch/10) ){
            addBalls(OFFSET_LEFT, OFFSET_TOP ,parseInt(h/10))
        }
        if( parseInt(h%10) !== parseInt(ch%10) ){
            addBalls(OFFSET_LEFT + 15 * (RADIUS + 1), OFFSET_TOP ,parseInt(h%10))
        }
        currentTime.hours = date.getHours();
    }
    updateBalls()
}

/**
 * 添加小球
 * @param x 起始x坐标
 * @param y 起始y坐标
 * @param num 数字
 */
function addBalls(x, y, num) {
    let value = number[num];
    for( let i = 0, l = value.length; i < l; i++){
        for(let j = 0, m = value[i].length; j < m; j++){
            if (value[i][j] === 1){
                let ball = {
                    x: x + RADIUS+1 + j * 2 * (RADIUS + 1), // 圆心x
                    y: y + RADIUS+1 + i * 2 * (RADIUS + 1), // 圆心
                    g: 1.5 + Math.random(), //加速度
                    vx: Math.pow(-1, Math.ceil(Math.random() * 10)) * 4, //x方向速度
                    vy: -5, // 方向速度
                    color: colors[Math.floor(Math.random() * colors.length)] //颜色
                };
                balls.push(ball);
            }
        }
    }
}

function updateBalls(){

    let length = balls.length;
    for(let i = 0; i < length; i++){
        let b = balls[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += b.g;
        if( b.y >= Height - RADIUS){
            b.y = Height - RADIUS;
            b.vy = -b.vy * 0.8;
        }
    }
    let count = 0;
    for(let i = 0; i < length; i++){
        let b = balls[i];
        if( b.x - RADIUS >0 && b.x + RADIUS < WIDTH){
            balls[count++] = b;
        }
    }
    while (balls.length > count){
        balls.pop()
    }
}
/**
 * 渲染时钟
 * @param ctx 绘图上下文
 */
function render(ctx) {
    let hours = currentTime.hours; //小时\\\
    let minutes = currentTime.minutes; //分钟
    let seconds = currentTime.seconds; //秒

    ctx.clearRect(0, 0, WIDTH, Height);
    // 小时
    renderNumber(OFFSET_LEFT, OFFSET_TOP ,parseInt(hours/10), ctx);
    renderNumber(OFFSET_LEFT + 15 * (RADIUS + 1), OFFSET_TOP, parseInt(hours%10), ctx);
    // 冒号
    renderNumber(OFFSET_LEFT + 30 * (RADIUS + 1), OFFSET_TOP, 10, ctx);
    // 分钟
    renderNumber(OFFSET_LEFT + 39 * (RADIUS + 1), OFFSET_TOP, parseInt(minutes/10), ctx);
    renderNumber(OFFSET_LEFT + 54 * (RADIUS + 1), OFFSET_TOP, parseInt(minutes%10), ctx);
    // 冒号
    renderNumber(OFFSET_LEFT + 69 * (RADIUS + 1), OFFSET_TOP, 10, ctx);
    // 秒
    renderNumber(OFFSET_LEFT + 78 * (RADIUS + 1), OFFSET_TOP, parseInt(seconds/10), ctx);
    renderNumber(OFFSET_LEFT + 93 * (RADIUS + 1), OFFSET_TOP, parseInt(seconds%10), ctx);

    for( let i = 0, b; b = balls[i++];){
        ctx.beginPath();
        ctx.fillStyle = b.color;
        ctx.arc(
            b.x,
            b.y,
            RADIUS,
            0,
            Math.PI * 2
        );
        ctx.fill()
    }
}

/**
 * 绘制数字
 * @param x 起始x坐标
 * @param y 起始y坐标
 * @param num 要绘制的数字
 */
function renderNumber(x, y, num, ctx) {
    ctx.fillStyle = "#ff0000";
    let value = number[num];
    for( let i = 0, l = value.length; i < l; i++){
        for(let j = 0, m = value[i].length; j < m; j++){
            if (value[i][j] === 1){
                ctx.beginPath();
                ctx.arc(
                    x + RADIUS+1 + j * 2 * (RADIUS + 1),
                    y + RADIUS+1 + i * 2 * (RADIUS + 1),
                    RADIUS,
                    0,
                    2 * Math.PI
                );
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}