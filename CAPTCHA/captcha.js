/**
 * 验证码生成类
 */
class CAPTCHA{
    // 画布对象
    captcha = null;
    // 画笔对象
    ctx = null;
    // 干扰线/点数量
    line_count = 0;
    opint_count = 0;
    // 当前验证码的值
    value = "";

    /**
     * 宽高比为 2:1 最为合适
     * @param {*} x 左上角顶点距左边界的距离
     * @param {*} y 左上角顶点距上边界的距离
     * @param {*} width 验证码宽度
     * @param {*} height 验证码高度
     * @param {*} line_count 干扰线数目
     * @param {*} opint_count 干扰点数目
     */
    constructor(x,y,width,height,line_count,opint_count){
        // 放置画布
        let node = document.createElement("canvas");
        node.width = width || 200;
        node.height = height || 100;
        node.style.position = 'absolute';
        let left = x || 0;
        let top = y || 0;
        node.style.left = left+'px';
        node.style.top = top+'px';
        node.style.backgroundColor = '#f7f5f5';
        document.body.appendChild(node);

        // 初始化
        this.captcha = node;
        this.ctx = node.getContext('2d');
        this.line_count = line_count || 5;
        this.opint_count = opint_count || 5;

        this.draw();
        this.Clickbind();
    }

    // 随机颜色
    getRamdomColor(){
        let r = Math.round(Math.random()*255);
        let g = Math.round(Math.random()*255);
        let b = Math.round(Math.random()*255);
        return `rgb(${r},${g},${b})`;
    }

    // 随机验证码
    generateMixed() {
        let chars = ["0","1","2","3","4","5","6","7","8","9",
            "A","B","C","D","E","F","G","H","I","J","K","L",
            "M","N","O","P","Q","R","S","T","U","V","W","X",
            "Y","Z","a","b","c", "d","e","f","g","h","i","j",
            "k","l","m","n","o","p","q","r","s","t","u","v",
            "w","x","y","z"
        ];
        let res = [];
        for (let i = 0; i < 4; i++) {
          let id = Math.round(Math.random() * 61);
          res.push(chars[id]);
        }
        return res;
      }

    draw(){
        // 清除画布
        this.ctx.clearRect(0,0,this.captcha.width,this.captcha.height);
        // 随机干扰线
        for(let i=0;i<this.line_count;i++){
            this.ctx.beginPath();
            //起始点
            this.ctx.moveTo(Math.random()*this.captcha.width,Math.random()*this.captcha.height);
            //结束点
            this.ctx.lineTo(Math.random()*this.captcha.width,Math.random()*this.captcha.height);
            this.ctx.strokeStyle = this.getRamdomColor();
            this.ctx.stroke();
            this.ctx.closePath();
        }

        // 随机干扰点
        for(let i=0;i<this.opint_count;i++){
            this.ctx.beginPath();
            let x = Math.random()*this.captcha.width;
            let y = Math.random()*this.captcha.height;
            this.ctx.arc(x,y,1,0,2*Math.PI);
            this.ctx.fillStyle = this.getRamdomColor();
            this.ctx.fill();
            this.ctx.closePath();
        }

        // 验证码数字
        let res = this.generateMixed();
        let result = "";
        for(let i=0,len=res.length;i<len;i++){
            this.ctx.save();
            let spacsX = this.captcha.width/len;
            let spacsY = this.captcha.height/2;
            let x = spacsX*i+spacsX/4;
            let y = spacsY+Math.random()*spacsY/2;
            let txt = res[i];
            this.ctx.font = `bold ${spacsX-5}px 微软雅黑`;
            this.ctx.fillStyle = this.getRamdomColor();
            // 水平垂直位移
            this.ctx.translate(x,y);
            // 旋转
            this.ctx.rotate(Math.random()*Math.PI/2-Math.PI/4);
            // 写入
            this.ctx.fillText(txt,0,0);
            this.ctx.restore();
            result += txt;
        }
        this.value = result;
    }

    // 点击更新绑定
    Clickbind(){
        this.captcha.onclick = ()=>{
            this.draw();
        }
    }

}