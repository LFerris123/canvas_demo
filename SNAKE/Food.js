class Food{
    constructor(){
        // 位置
        this.X =Math.round(Math.random()*49);
        this.Y =Math.round(Math.random()*49);
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.X*spacs,this.Y*spacs,spacs,spacs);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}