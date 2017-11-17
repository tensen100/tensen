var Game = function () {
    // dom 元素
    let gameDiv;
    let nextDiv;
    // 游戏矩阵
    let nextData =(() => {
        let data = [];
        for (let i = 0;i < 4; i++) {
            let temArr = [];
            for(let j = 0;j < 4; j++) {
                temArr.push(0)
            }
            data.push(temArr);
        }
        return data;
    })();
    let gameData = (() => {
        let data = [];
        for (let i = 0; i < 20; i++) {
            let temArr = [];
            for (let j = 0; j < 10; j++) {
                temArr.push(0)
            }
            data.push(temArr)
        }
        return data;
    })();

    // 当前方块
    let cur;

    // 下一个方块
    let next;
    // divs
    let nextDivs = [];
    let gameDivs = [];

    /**
     * 初始化div
     * @param container 容器
     * @param divs 存放div的数组
     * @param data 矩阵
     */
    let initDiv = function (container, divs, data) {
        data.forEach( (item, i) => {
            let div = [];
            item.forEach( (v, j) => {
                let newNode = document.createElement('div');
                newNode.className = 'none';
                newNode.style.top = (i * 20) + 'px';
                newNode.style.left = (j * 20) + 'px';
                container.appendChild(newNode);
                div.push(newNode)
            });
            divs.push(div);
        });
    };

    /**
     * 刷新div
     * @param data 矩阵
     * @param divs div数组
     */
    let refreshDiv = function (data, divs) {
        data.forEach( (item, i) => {
            item.forEach( (status, j) => {
                let className = 'none';
                switch (status) {
                    case 0:
                        className = 'none';
                        break;
                    case 1:
                        className = 'done';
                        break;
                    case 2:
                        className = 'current';
                        break;

                }
                divs[i][j].className = className;
            })
        });
    };

    /**
     * 监测是否合法
     * @param pos
     * @param x
     * @param y
     */
    let check = function (pos) {
        for(let i = 0,length = cur.data.length; i <length; i++){
            for( let j = 0 ,length2 = cur.data[i].length; j < length2; j++){
                if(cur.data[i][j]){
                    if (pos.y + i < 0 ||
                        pos.y + i >= gameData.length ||
                        pos.x + j < 0 ||
                        pos.x + j >= gameData[0].length ||
                        gameData[pos.y + i][pos.x + j] === 1 ){
                        return false;
                    }
                }
            }
        }
        return true;
    };

    /**
     * 设置数据
     */
    let setData = function () {
        cur.data.forEach( (row ,i) => {
            row.forEach( (n ,j) => {
                if(n){
                    gameData[cur.origin.y + i][cur.origin.x + j] = n;
                }
            })
        });
    };

    /**
     * 清理数据
     */
    let clearData = function () {
        cur.data.forEach( (row, i) => {
            row.forEach((v, j)=>{
                if(v){
                    gameData[cur.origin.y + i][cur.origin.x + j]=0;
                }
            })
        })
    };

    /**
     * 下移
     */
    let down = function () {
        console.log('down');
        let nextOrigin = {
            x: cur.origin.x,
            y: cur.origin.y+1
        };
        if( check(nextOrigin)){
            clearData();
            cur.origin = nextOrigin;
            setData();
            refreshDiv(gameData, gameDivs)
        }
    };

    /**
     * 左右移动
     * @param n:-1 left,1 right
     */
    let move = function (n) {
        console.log('left');
        let nextOrigin = {
            x: cur.origin.x + n,
            y: cur.origin.y
        };
        if( check(nextOrigin)){
            clearData();
            cur.origin = nextOrigin;
            setData();
            refreshDiv(gameData, gameDivs)
        }
    };

    let rotate = function () {
        console.log('rotate')
    };

    /**
     * 初始化
     * @param doms
     */
     let init = function (doms) {
         gameDiv = doms.gameDiv;
         nextDiv = doms.nextDiv;
         cur = new Square();
         next = new Square();
         initDiv(gameDiv, gameDivs, gameData);
         initDiv(nextDiv, nextDivs, nextData);
         cur.origin.x = 1;
         cur.origin.y = 2;
         setData();
         refreshDiv(gameData, gameDivs);
         refreshDiv(next.data, nextDivs)
     };

     // 导出
     this.init = init;
     this.down = down;
     this.move = move;
     this.rotate = rotate;
};