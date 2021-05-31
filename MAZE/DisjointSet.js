class DisjointSet{
    // 并查集森林
    tree = null;

    constructor(size){
        // size大小的元素规格，用-1填充
        // 当tree[index]为负时，表示index为根节点，绝对值表示该集合的大小，否则表示index的上级节点
        this.tree = new Array(size).fill(-1);
    }

    // 查找index的根节点
    search(index){
        // new_index是index的上级节点
        let new_index = this.tree[index];
        // index没有上级节点，本身就是根节点
        if(new_index<0) return index;
        // 有上级节点时，判断是否有更上级节点
        while(this.tree[new_index]>=0){
            // 路径压缩，new_index作为中间级，使index与this.tree[new_index]直接联系
            this.tree[index] = this.tree[new_index];
            // index,new_index均往上运动
            index = new_index;
            new_index = this.tree[new_index];
        }
        // 直到new_index没有了上级节点，new_index即为根节点
        return new_index;
    }

    // 将indexA与indexB所在的两个集合合并
    union(indexA,indexB){
        // 分别找到对应的根节点
        let Fa = this.search(indexA);
        let Fb = this.search(indexB);
        // 两个集合的大小
        let lenA = -this.tree[Fa];
        let lenB = -this.tree[Fb]; 
        // 让较小集合的根节点指向较大集合的根节点
        if(lenA >= lenB){
            this.tree[Fb] = Fa;
            this.tree[Fa] = -(lenA+lenB);
        }else{
            this.tree[Fa] = Fb;
            this.tree[Fb] = -(lenA+lenB);
        }
    }

    // 判断indexA与indexB是否在一个集合中
    isConnect(Aindex,Bindex){
        // 判断是否为同一个根节点
        if(this.search(Aindex) === this.search(Bindex)){
            return true;
        }
        return false;
    }
}