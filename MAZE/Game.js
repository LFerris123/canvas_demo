
// 迷宫规格
var spacs = 18;
// 画布对象 (正方形)
var canvas = document.getElementById("canvas");
// 画笔对象
var ctx = canvas.getContext("2d");

// 格子的大小
var size = canvas.width/spacs;

// 画出迷宫格子
function draw(){
    for(let i=1;i<spacs;i++){
        ctx.strokeStyle='gray';
        ctx.moveTo(i*size,0);
        ctx.lineTo(i*size,size*spacs);
        ctx.stroke();
        ctx.moveTo(0,i*size);
        ctx.lineTo(size*spacs,i*size);
        ctx.stroke();
    }
}
// 格子 (初始化都有墙壁)
class Cell{
    constructor(){
        this.CanLeft = false;
        this.CanRight = false;
        this.CanUp = false;
        this.CanDown = false;
    }
}
// 迷宫 / 初始化
function initMaze(){
    for(let i=0;i<spacs;i++){
        Maze[i] = new Array(spacs);
        for(let j=0;j<spacs;j++){
            Maze[i][j] = new Cell();
        }
    }
}

// 并查集生成迷宫
function MakeMaze(){
    while(!disjointSet.isConnect(0,spacs*spacs-1)){
        // 随机选中一个格子
        let index = RamdomCell();
        let row = index%spacs;
        let column = Math.floor(index/spacs);
        // 随机选中该格子相邻格子
        let ramdomNeighbor = RamdomNeighbor(row,column);
        // 如果连通
        if(disjointSet.isConnect(index,ramdomNeighbor.index)) continue;
    
        // 去掉墙壁
        switch(ramdomNeighbor.deraction){
            case "左":
                Maze[row][column].CanLeft = true;
                Maze[ramdomNeighbor.row][ramdomNeighbor.column].CanRight = true;
                break;
            case "右":
                Maze[row][column].CanRight = true;
                Maze[ramdomNeighbor.row][ramdomNeighbor.column].CanLeft = true;
                break;
            case "上":
                Maze[row][column].CanUp = true;
                Maze[ramdomNeighbor.row][ramdomNeighbor.column].CanDown = true;
                break;
            case "下":
                Maze[row][column].CanDown = true;
                Maze[ramdomNeighbor.row][ramdomNeighbor.column].CanUp = true;
                break;
            default:
                break;
        }
    
        // 并查集合并
        disjointSet.union(index,ramdomNeighbor.index);
    }
}

function RamdomCell(){
    return Math.round(Math.random()*(spacs*spacs-1));
}
function RamdomNeighbor(row,column){
    let canTo = [];

    if(row-1>=0) 
        canTo.push({
            index:row-1+column*spacs,
            deraction:"左",
            row:row-1,
            column:column
        });
    if(row+1<spacs) 
        canTo.push({
            index:row+1+column*spacs,
            deraction:"右",
            row:row+1,
            column:column
        });
    if(column-1>=0) 
        canTo.push({
            index:row+(column-1)*spacs,
            deraction:"上",
            row:row,
            column:column-1
        });
    if(column+1<spacs) 
        canTo.push({
            index:row+(column+1)*spacs,
            deraction:"下",
            row:row,
            column:column+1
        });

    let ram = Math.floor(Math.random()*canTo.length);
    return canTo[ram];
}

// 擦去墙壁
function disDraw(){
    for(let i=0;i<spacs;i++){
        for(let j=0;j<spacs;j++){
            if(Maze[i][j].CanLeft){
                ctx.strokeStyle = "white";
                ctx.clearRect(size*i-1,size*j,2,size);
            }
            if(Maze[i][j].CanRight){
                ctx.strokeStyle = "white";
                ctx.clearRect(size*(i+1)-1,size*j,2,size);
            }
            if(Maze[i][j].CanUp){
                ctx.strokeStyle = "white";
                ctx.clearRect(size*i,size*j-1,size,2);
            }
            if(Maze[i][j].CanDown){
                ctx.strokeStyle = "white";
                ctx.clearRect(size*i,size*(j+1)-1,size,2);
            }
        }
    }
}

function addMeAndYou(){
    ctx.beginPath();
    ctx.rect(me.row*size+size/5,me.column*size+size/5,size*3/5,size*3/5);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.beginPath();
    ctx.rect((spacs-1)*size+size/5,(spacs-1)*size+size/5,size*3/5,size*3/5);
    ctx.fillStyle = "pink";
    ctx.fill();
}

// 初始化画布并生成迷宫
function init(){
    ctx.clearRect(0,0,canvas.width,canvas.width);
    draw();
    disDraw();
    addMeAndYou();
}

var Maze = new Array(spacs);
initMaze();
var disjointSet = new DisjointSet(spacs*spacs);
MakeMaze();
var me = {
    row:0,
    column:0
}
init();

document.addEventListener("keydown",(e)=>{
    switch(e.keyCode){
        case 37:
            if(Maze[me.row][me.column].CanLeft){
                me.row--;
            }
            init();
            break;
        case 38:
            if(Maze[me.row][me.column].CanUp){
                me.column--;
            }
            init();
            break;
        case 39:
            if(Maze[me.row][me.column].CanRight){
                me.row++;
            }
            init();
            break;
        case 40:
            if(Maze[me.row][me.column].CanDown){
                me.column++;
            }
            init();
            break;
        default:
            break;
    }
    if(is_Win()){
        alert("成功到达终点！");
        Maze = new Array(spacs);
        initMaze();
        disjointSet = new DisjointSet(spacs*spacs);
        MakeMaze();
        me = {
            row:0,
            column:0
        }
        init();
    }
})

function is_Win(){
    if(me.row === spacs-1 &&
        me.column ===spacs-1){
            return true;
        }
    return false;
}