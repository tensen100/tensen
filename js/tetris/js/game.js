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
     * 碰撞检测
     */
    let isCrash = function () {
        for(let i = 0,length = cur.pattern.length; i <length; i++){
            for( let j = 0 ,length2 = cur.pattern[i].length; j < length2; j++){
                if(cur.pattern[i][j]){
                    if (cur.y + i < 0 ||
                        cur.y + i >= gameData.length ||
                        cur.x + j < 0 ||
                        cur.x + j >= gameData[0].length ||
                        gameData[cur.y + i][cur.x + j] === 1 ){
                        cur.restoreBackup();
                        return true;
                    }
                }
            }
        }
        return false;
    };

    /**
     * 刷新数据数据
     */
    let refreshData = function () {
        cur.pattern.forEach( (row ,i) => {
            row.forEach( (n ,j) => {
                if(n){
                    gameData[cur.y + i][cur.x + j] = n;
                }
            })
        });
    };

    /**
     * 清理数据
     */
    let clearData = function () {
        cur.backupData.pattern.forEach( (row, i) => {
            row.forEach((v, j)=>{
                if(v){
                    gameData[cur.backupData.y + i][cur.backupData.x + j]=0;
                }
            })
        })
    };

    let flex = function () {
        for(let i = 0, length1 = gameData.length; i < length1; i++){
            for(let j = 0, length2 = gameData[i].length; j < length2; j++){
                if(gameData[i][j] === 2){
                    gameData[i][j] =1
                }
            }
        }
        console.log(gameData);
        refreshDiv(gameData, gameDivs)
    };

    let clearLine = function () {
        for(let i = 0, length1 = gameData.length; i < length1;i++){
            let clear  = true;
            for(let j = 0, length2 = gameData[i]; j<length2; j++){
                if(gameData[i][j] === 0){
                    clear = false;
                }
            }
            if (clear){
                gameData.splice(i,1);
                gameData.push([0,0,0,0,0,0,0,0,0,0])
            }
        }
        update()
    };

    /**
     * 更新游戏
     */
    let update = function () {
        if(isCrash()){return false}
        clearData();
        refreshData();
        refreshDiv(gameData,gameDivs);
        cur.backup();
        return true;
    };

    /**
     * 下移
     */
    let down = function () {
        cur.y++;
        let isDown = update();
        // console.log(isDown);
        if(!isDown){
            flex();
            // clearLine()
        }
        return isDown
    };

    /**
     * 坠落
     */
    let fall = function () {
        console.log('fall');
        while(down());
    };

    /**
     * 左右移动
     * @param n:-1 left,1 right
     */
    let move = function (n) {
        cur.x += n;
        update();
    };

    /**
     * 旋转
     */
    let rotate = function () {
        cur.rotate(1);
        update()
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
         refreshData();
         refreshDiv(gameData, gameDivs);
         refreshDiv(next.pattern, nextDivs)
     };

     // 导出
     this.init = init;
     this.down = down;
     this.move = move;
     this.rotate = rotate;
     this.fall = fall;
};