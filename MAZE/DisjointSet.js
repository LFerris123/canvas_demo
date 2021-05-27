class DisjointSet{
    // 并查集森林
    tree = null;

    constructor(size){
        this.tree = new Array(size).fill(-1);
    }

    search(index){
        while(this.tree[index]>=0){
            index = this.tree[index];
        }
        return index;
    }

    union(indexA,indexB){
        let Fa = this.search(indexA);
        let Fb = this.search(indexB);
        let lenA = -this.tree[Fa];
        let lenB = -this.tree[Fb]; 
        if(lenA >= lenB){
            this.tree[Fb] = Fa;
            this.tree[Fa] = -(lenA+lenB);
        }else{
            this.tree[Fa] = Fb;
            this.tree[Fb] = -(lenA+lenB);
        }
    }

    isConnect(Aindex,Bindex){
        if(this.search(Aindex) === this.search(Bindex)){
            return true;
        }
        return false;
    }

}