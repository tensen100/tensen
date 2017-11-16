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
    let check = function (pos, x, y) {
        // console.log(pos);
        let c;
        if (pos.x + x < 0 ){
            c = false;
        }else if (pos.x + x >= gameData.length){
            c = false;
        }else if(pos.y + y < 0){
            c = false;
        }else if(pos.y + y >= gameData[0].length){
            c = false;
        }else if(gameData[pos.x + x][pos.y + y] === 1){
            c = false;
        }else {
            c = true;
        }
        return c;
    };

    /**
     * 设置数据
     */
    let setData = function () {
        cur.data.forEach( (row ,i) => {
            row.forEach( (n ,j) => {
                if(check(cur.origin, i, j)){
                    gameData[cur.origin.x + i][cur.origin.y + j] = n;
                }
            })
        });
    };

    /**
     * 清理数据
     */
    let clearData = function () {
        gameData.forEach( (row, i) => {
            row.forEach((v, j)=>{
                gameData[i][j]=0;
                /*if(check(cur.origin, i, j)){

                }*/
            })
        })
    };

    /**
     * 下移
     */
    let down = function () {
        console.log('down');
        cur.origin.x ++;
        clearData();
        setData();
        refreshDiv(gameData, gameDivs)
    };

    /**
     * 左移动
     */
    let left = function () {
        console.log('left');
    };

    /**
     * 右移
     */
    let right = function () {
        console.log('right');
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
         cur.origin.x = 10;
         cur.origin.y = 5;
         setData();
         refreshDiv(gameData, gameDivs);
         refreshDiv(next.data, nextDivs)
     };

     // 导出
     this.init = init;
     this.down = down;
     this.left = left;
     this.right = right;
};