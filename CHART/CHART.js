class CHART{
    PIE_CHART = 0;
    BAR_CHART = 1;

    /**
     * 
     * @param {*} statics 数据 
     *   数据输入格式 
            statics = {
                title : 统计图名称
                data  :[
                    {
                        name  : 名称 default varchar{index}
                        num   : 正数
                    },...
                ]
            }
     * @param {*} x    定位
     * @param {*} y    定位
     * @param {*} size 高度规格 默认值为500 ; 宽度为高度的6/5 
     * @param {*} type 类型 PIE_CHART | BAR_CHART  ===  0 | 1
     */
    constructor(statics,x,y,size,type){
        let left = x || 0;
        let top = y || 0;
        this.size = size || 500;
        this.type = type || this.PIE_CHART;
        if(statics.title === undefined){
            statics.title = (this.type===this.PIE_CHART) ? "饼状图":"柱状图";
        }
        statics.data.forEach((element,index) => {
            if(element.name === undefined){
                element.name = `varchar${index+1}`;
            }
        });
        this.statics = statics;

        let node = document.createElement("canvas");
        node.style.position = "absolute";
        node.style.left = left + "px";
        node.style.top = top + "px";
        node.width = this.size*6/5;
        node.height = this.size;
        document.body.appendChild(node);

        this.chart = node;
        this.ctx = node.getContext("2d");

        this.setRatio();
        this.addColor();
        this.toAngle();
        this.toHeightRate();
        this.init();
        this.bindEvent();
    }

    /**
     * 初始化
     * @param {*} x 当前鼠标位置 可缺省
     * @param {*} y 当前鼠标位置 可缺省
     */
    init(x,y){
        let mouseX = x || 0;
        let mousrY = y || 0;
        if(this.type===this.PIE_CHART){
            this.drawPIECHART(mouseX,mousrY);
        }else{
            this.drawBARCHART(mouseX,mousrY);
        }
    }

    // 鼠标事件
    bindEvent(){
        this.chart.addEventListener("mousemove",(e)=>{
            //获取鼠标相对于画布的位置
            let x = e.clientX - this.chart.getBoundingClientRect().left;
            let y = e.clientY - this.chart.getBoundingClientRect().top;
            this.init(x,y);
        })
    }

    // 适应屏幕分辨率
    setRatio(){
        let d = window.devicePixelRatio || 1;
        let cd = this.ctx.backingStorePixelRatio || 1;
        this.r = d/cd;
        let w = this.chart.width;
        let h = this.chart.height;
        this.chart.width = this.r*w;
        this.chart.height = this.r*h;
        this.chart.style.width = w;
        this.chart.style.height = h;
    }

    // 随机颜色
    getRamdomColor(){
        let r = Math.floor(Math.random()*256);
        let g = Math.floor(Math.random()*256);
        let b = Math.floor(Math.random()*256);
        return `rgb(${r},${g},${b})`;
    }

    // 添加颜色属性
    addColor(){
        this.statics.data.forEach(element =>{
            element.color = this.getRamdomColor();
        })
    }

    // 饼状图
    drawPIECHART(mouseX,mouseY){
        this.ctx.clearRect(0,0,this.chart.width,this.chart.height);
        this.ctx.translate(this.size*3/5,this.size*3/5);

        this.drawTitle();
        
        let start = 0;
        let r = this.size*8/25;
        this.statics.data.forEach( element =>{
            // 饼形
            let end = start+element.angle;
            this.ctx.beginPath();
            this.ctx.moveTo(0,0);
            this.ctx.arc(0,0,r,start,end,false);
            this.ctx.closePath();
            //是否鼠标在路径中
            if(this.ctx.isPointInPath(mouseX*this.r,mouseY*this.r)){
                element.flag = true;
                this.ctx.beginPath();
                this.ctx.moveTo(0,0);
                this.ctx.arc(0,0,r*10/9,start,end,false);
                this.ctx.closePath();
            }else{
                element.flag = false;
            }
            this.ctx.fillStyle = element.flag ? "#f00":element.color;
            this.ctx.fill();
            // 延长线
            let lineLength = element.flag ? r*5/4:r*8/7;
            let outX = lineLength*Math.cos((start+end)/2);
            let outY = lineLength*Math.sin((start+end)/2);
            this.ctx.beginPath();
            this.ctx.moveTo(0,0);
            this.ctx.lineTo(outX,outY);
            this.ctx.strokeStyle = element.flag ? "#f00":element.color;
            this.ctx.stroke();
            // 名称
            this.ctx.font = `${element.flag ? this.size/35:this.size/45}px 微软雅黑`;
            this.ctx.textAlign = outX > 0 ? 'left':'right';
            this.ctx.textBaseline = "bottom";//已底部为基准
            this.ctx.fillStyle = element.flag ? "#f00":element.color;
            this.ctx.fillText(element.name,outX,outY);
            // 下划线
            let textW = this.ctx.measureText(element.name).width;
            this.ctx.moveTo(outX,outY);
            let textEndX = outX > 0 ? outX + textW : outX - textW;
            this.ctx.lineTo(textEndX,outY);
            this.ctx.stroke();
            
            start = end;
        })

        this.ctx.translate(-this.size*3/5,-this.size*3/5);
        this.drawLengend();
    }

    // 数据转弧度
    toAngle(){
        let all = 0;
        this.statics.data.forEach(element=>{
            all += element.num;
        })
        this.statics.data.forEach(element=>{
            let angle = element.num/all * Math.PI*2;
            element.angle = angle;
        })
    }

    // 柱状图
    drawBARCHART(mouseX,mouseY){
        this.ctx.clearRect(0,0,this.chart.width,this.chart.height);
        this.ctx.translate(this.size*3/5,this.size*3/5);
        this.drawTitle();

        // 坐标轴
        let r = this.size*8/25;
        this.ctx.beginPath();
        this.ctx.moveTo(-r,r);
        this.ctx.lineTo(r,r);
        this.ctx.moveTo(-r,r);
        this.ctx.lineTo(-r,-r);
        this.ctx.stroke();
        this.ctx.closePath();

        let len = this.statics.data.length;
        this.statics.data.forEach((element,index) =>{
            // 柱形
            this.ctx.beginPath();
            let h = element.heightrate*2*r;
            let w = 2*r/len;
            this.ctx.rect(-r+w*(index+1/5),r-h,3*w/5,h);
            this.ctx.closePath();
            if(this.ctx.isPointInPath(mouseX*this.r,mouseY*this.r)){
                element.flag = true;
                this.ctx.beginPath();
                h = h*7/6;
                this.ctx.rect(-r+w*(index+1/10),r-h,4*w/5,h);
                this.ctx.closePath();
            }else{
                element.flag = false;
            }
            this.ctx.fillStyle = element.flag ? "#f00":element.color;
            this.ctx.fill();

            // 数量
            this.ctx.beginPath();
            this.ctx.font = `${this.size/25}px 微软雅黑`;
            this.ctx.fillStyle = element.flag ? "#f00":element.color;
            let textW = this.ctx.measureText(element.num).width;
            this.ctx.textBaseline = "bottom";
            this.ctx.fillText(element.num,-r+w*(index+1/5)+(3*w/5-textW)/2,r-h-1);
            this.ctx.closePath();
        })

        this.ctx.translate(-this.size*3/5,-this.size*3/5);
        this.drawLengend();
    }

    // 数据转高度比例
    toHeightRate(){
        let max = 0;
        this.statics.data.forEach(element=>{
            max = element.num > max ? element.num : max;
        })
        this.statics.data.forEach(element=>{
            let heightrate = element.num/max;
            element.heightrate = heightrate*0.8;
        })
    }

    // 统计图名称
    drawTitle(){
        this.ctx.beginPath();
        this.ctx.font = `${this.size/22}px 微软雅黑`;
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(this.statics.title,-this.size/10,-this.size*9/20);
        this.ctx.closePath();
    }

    // 图例
    drawLengend(){
        let length = this.size/4;
        this.statics.data.forEach((element,index)=>{
            this.ctx.beginPath();
            this.ctx.rect(length*2/25,length*6/25*(index+1),length*8/25,length*4/25);
            this.ctx.fillStyle = element.flag ? "#f00":element.color;
            this.ctx.fill();
            this.ctx.font = `${this.size/45}px 微软雅黑`;
            this.ctx.textAlign = 'left';
            this.ctx.fillText(element.name,length*12/25,length*6/25*(index+1)+length*4/25);
        })
    }
    
}