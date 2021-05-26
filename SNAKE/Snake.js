class Snake{

    // 蛇身队列
    tails = [];
    // 速度与方向
    dx = speed;
    dy = 0;

    constructor(){
        let head = new Food();
        head.X = size/2;
        head.Y = size/2;
        head.color = "#fff";
        this.tails.push(head);

        this.draw();
    }
    start(){
        if(isStart) return;
        isStart = true;
        const this_ = this;
        raf = requestAnimationFrame(function run(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            this_.update();
            if(this.isBump()){
                alert(`得分为${score}`);
                score = 0;
                Score.innerText = score;
                Reset.click();
                return;
             }
            this_.draw();
            food.draw();
            raf = requestAnimationFrame(run);
        });
    }

    // 画蛇
    draw(){
        this.tails.forEach(item =>{
            item.draw();
        })
    }

    // 速度更新
    updateSpeed(){
        speed = initSpeed + this.tails.length*0.005;
        this.dy = (this.dy===0) ? 0:((this.dy>0) ? speed:-speed);
        this.dx = (this.dx===0) ? 0:((this.dx>0) ? speed:-speed);
    }

    // 位置更新
    update(){
        let len = this.tails.length;
        let lastX = this.tails[len-1].X;
        let lastY = this.tails[len-1].Y;
        for(let i=len-1;i>0;i--){
            this.tails[i].X = this.tails[i-1].X;
            this.tails[i].Y = this.tails[i-1].Y;
        }
        this.tails[0].X += this.dx;
        this.tails[0].Y += this.dy;
        if(this.tails[0].X > size) this.tails[0].X -= size;
        if(this.tails[0].X < 0) this.tails[0].X += size;
        if(this.tails[0].Y > size) this.tails[0].Y -= size;
        if(this.tails[0].Y < 0) this.tails[0].Y += size;
        if(this.canEat()){
            food.X = lastX;
            food.Y = lastY;
            food.color = "write";
            score++;
            Score.innerText = score;
            this.tails.push(food);
            this.updateSpeed();
            RamdomFood();
        }
    }

    // 判断食物是否随机出现在蛇上
    isBody(){
        for(let i=0,len=this.tails.length;i<len;i++){
            if(food.X === this.tails[i].X &&
                food.Y === this.tails[i].Y){
                   return true; 
                }
        }
        return false;
    }

    // 判断是否能吃食物
    canEat(){
        if(Math.abs(this.tails[0].X-food.X)<1 &&
            Math.abs(this.tails[0].Y-food.Y)<1){
            return true;
        }
        return false;
    }

    // 判断是否撞到蛇身
    isBump(){
        let Part = this.tails[0];
        for(let i=1,len=this.tails.length;i<len;i++){
            if(Part.X === this.tails[i].X &&
                Part.Y === this.tails[i].Y){
                   return true; 
                }
        }
        return false;
    }
}
