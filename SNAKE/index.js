// 画布
var canvas = document.getElementById("canvas");
var Score = document.getElementById("score");
var score = 0;
var Start = document.getElementById("start");
var Stop = document.getElementById("stop");
var Reset = document.getElementById("reset");

// 状态
isStart = false;

// 画笔
var ctx = canvas.getContext("2d");

// 划分成50*50的大小
var size = 50;

// 每个格子为10px*10px的规格
var spacs = 10;


// 🐍的初始移动速度为0.2个格子每帧
var initSpeed = 0.2;
// 🐍的速度，每吃一个食物增加0.005
var speed = initSpeed;

// 产生一条🐍
var snake = new Snake();

//循环运动的返回值
var raf = null;

//当前的食物
var food = null;

// 随机食物
function RamdomFood(){
    food = new Food();
    if(snake.isBody(food)){
        RamdomFood();
    }else{
        food.color = "#f00";
    }
}
RamdomFood();
food.draw();

Start.addEventListener("click",()=>{
    snake.start()
})
Stop.addEventListener("click",()=>{
    cancelAnimationFrame(raf);
    isStart = false;
})
Reset.addEventListener("click",()=>{
    cancelAnimationFrame(raf);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    snake = new Snake();
    RamdomFood();
    food.draw();
    isStart = false;
})

document.addEventListener("keydown",(e)=>{
    if(!isStart) return;
    switch(e.keyCode){
        //左
        case 37:
            if(snake.dx==0){
                snake.dx = -speed;
                snake.dy = 0;
            }
            break;
        //上
        case 38:
            if(snake.dy==0){
                snake.dy = -speed;
                snake.dx = 0;
            }
            break;
        //右
        case 39:
            if(snake.dx==0){
                snake.dx = speed;
                snake.dy = 0;
            }
            break;
        //下
        case 40:
            if(snake.dy==0){
                snake.dy = speed;
                snake.dx = 0;
            }
            break;
        default:
            break;
    }
})