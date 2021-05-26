/**
 * 时钟类
 */
class CLOCK{
    clock = null;
    ctx = null;
    size = 0;
    
    /**
     * 
     * @param {*} x 定位
     * @param {*} y 定位
     * @param {*} size 规格，默认300px
     */
    constructor(x,y,size){
        this.size = size || 300;
        let left = x || 0;
        let top = y || 0;

        //创建画布
        let node = document.createElement("canvas");
        node.width = this.size;
        node.height = this.size;
        node.style.position = "absolute";
        node.style.left = left + "px";
        node.style.top = top + "px";
        document.body.appendChild(node);

        this.clock = node;
        this.ctx = node.getContext("2d");

        requestAnimationFrame(()=>{this.draw()});
    }
    draw(){
        let time = new Date();
        let h = time.getHours()>12 ? time.getHours() -12 : time.getHours();
        let m = time.getMinutes();
        let s = time.getSeconds();

        let r = this.size/2 - 10;
        this.ctx.clearRect(0,0,this.size,this.size);
        this.ctx.save();
        this.ctx.translate(this.size/2,this.size/2);
        this.ctx.lineCap = "round";
        
        // 绘制外表盘
        this.ctx.beginPath();
        this.ctx.arc(0,0,r,0,2*Math.PI);
        this.ctx.moveTo(0,0);
        this.ctx.arc(0,0,5*r/140,0,2*Math.PI);
        this.ctx.lineWidth = r/20;
        this.ctx.strokeStyle = "#283b28";
        this.ctx.stroke();
        this.ctx.closePath();
        
        // 绘制12小时的刻度
        this.ctx.save();
        for(let i=0;i<12;i++){
            this.ctx.beginPath();
            this.ctx.rotate(Math.PI/6);
            this.ctx.moveTo(r*5/7,0);
            this.ctx.lineTo(r*6/7,0);
            this.ctx.lineWidth = r/28;
            this.ctx.stroke();
            this.ctx.closePath();
        }
        this.ctx.restore();

        // 绘制60分钟的刻度
        this.ctx.save();
        for(let i=0;i<60;i++){
            this.ctx.beginPath();
            this.ctx.rotate(Math.PI/30);
            this.ctx.arc(r*11/14,0,r/42,0,3*Math.PI);
            this.ctx.fillStyle = "orange";
            this.ctx.fill();
            this.ctx.closePath();
        }
        this.ctx.restore();

        // 秒针
        this.ctx.save();
        this.ctx.lineWidth = r/70;
        this.ctx.beginPath();
        this.ctx.rotate(Math.PI*s/30);
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(0,-r*4/7);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();

        //分针
        this.ctx.save();
        this.ctx.lineWidth = r/35;
        this.ctx.beginPath();
        this.ctx.rotate(Math.PI*(m+s/60)/30);
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(0,-r*5/14);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();

        //时针
        this.ctx.save();
        this.ctx.lineWidth = r*2/35;
        this.ctx.beginPath();
        this.ctx.rotate(Math.PI*(h+m/60+s/60/60)/6);
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(0,-r*3/14);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();

        this.ctx.restore();
        requestAnimationFrame(()=>{this.draw()});
    }
}