(function (canvas) {
    //每个方块的宽度
    var T=25;
    //canvas的宽度
    var WIDTH=(T+1)*12+(T+1)*7;
    //canvas的高度
    var HEIGHT=(T+1)*23;
    //游戏区域
    var gameArea={
        x:0,
        y:0,
        w:12*(T+1),
        h:23*(T+1)
    };
    //下一个方块区域
    var nextArea={
        x:13*(T+1),
        y:0,
        w:6*(T+1),
        h:6*(T+1)
    };
    //得分
    var score=0;
    //分数显示区域
    var scoreArea={
        x:13*(T+1),
        y:7*(T+1),
        w:(T+1)*6,
        h:(T+1)*16
    };
    //设置canvas宽高
    canvas.width=WIDTH;
    canvas.height=HEIGHT;
    //获取绘图对象
    var context=canvas.getContext("2d");
    //地图，12*23
    var map=eval("[" + Array(23).join("0x801,") + "0xfff]");
    //方块图案
    var tetris = [
        [0x6600],
        [0x2222, 0x0f00],
        [0xc600, 0x2640],
        [0x6c00, 0x4620],
        [0x4460, 0x2e0, 0x6220, 0x740],
        [0x2260, 0x0e20, 0x6440, 0x4700],
        [0x2620, 0x720, 0x2320, 0x2700]
    ];
    //按键对应的方法
    var keyDown = {
        "38" : "rotate(1)",
        "40" : "down()",
        "37" : "move(2, 1)",
        "39" : "move(0.5, -1)"
    };
    var curTetris;//当前的方块
    var nextTetris;//下一个方块
    var curPattern;//是前台正在下落的俄罗斯方块图案对象
    var nextPattern=[];//下一个落下的方块
    var nextPatternIndex;
    var backPattern;//存储图案对象的备份
    var run;//俄罗斯方块下落定时器
    /**
     * 初始化
     */
    function start(){
        //随机生成一个方块
        if(!nextTetris){
            nextTetris=tetris[~~(Math.random()*7)];
        }

        curTetris=nextTetris;
        // console.log("curTetris:"+curTetris);

        //初始化图案
        if(!nextPatternIndex){
            nextPatternIndex=~~(Math.random()*curTetris.length);
        }
        backPattern=curPattern={
            pattern:[],  //图案转换的二进制数据
            x:4, //x坐标
            y:0,//y坐标
            p:nextPatternIndex//当前图案的下标
        };

        rotate(0);

        nextTetris=tetris[~~(Math.random()*7)];
        // console.log("nextTetris:"+nextTetris);
        nextPatternIndex=~~(Math.random()*nextTetris.length);
        for(var i=0;i<4;i++){
            nextPattern[i]= (nextTetris[nextPatternIndex]>> (12 - i * 4) & 0x000f)
        }
        drawNext(context);
    }
    /**
     * 旋转图案
     * @param n 旋转角度
     */
    function rotate(n){
        //更新图案下标
        curPattern.p = (curPattern.p + n) % curTetris.length;
        //将图案转换为二进制数据
        for(var i=0;i<4;i++){
            curPattern.pattern[i]= (curTetris[curPattern.p]>> (12 - i * 4) & 0x000f)<<curPattern.x
        }
        //更新场景
        update(isCrash())
    }
    /**
     * 碰撞检测
     */
    function isCrash(){
        for(var i=0;i<4;i++){
            //将图案与地图按位与，不为0则发生碰撞
            // console.log("map:"+map[curPattern.y+i].toString(2));
            // console.log("pat:"+curPattern.pattern[i].toString(2));
            if((map[curPattern.y+i]&curPattern.pattern[i])!=0){
                //恢复备份
                return curPattern=backPattern;
            }
        }
    }

    /**
     * 更新视图
     * @param t 碰撞检测
     */
    function update(t){
        //更新备份,不能直接赋值，赋值只是建立了一个引用
        backPattern={
            pattern:curPattern.pattern.slice(0),  //图案转换的二进制数据
            x:curPattern.x, //x坐标
            y:curPattern.y,//y坐标
            p:curPattern.p//当前图案的下标
        };
        //如果发生碰撞，则不更新
        if(t){
            return
        }
        context.clearRect(T,0,(T+1)*10+1,(T+1)*22);
        //绘制已经存在的方块
        for(var i=0;i<map.length-1;i++){
            var m=map[i].toString(2);
            for(j=1;j<m.length-1;j++){
                if(m[j]==1){
                    // context.fillRect(j*T,i*T,T,T)
                    radiusRect(context,j*(T+1),i*(T+1),T,5,"#00bfff")
                }
            }
        }
        //在场景中绘制方块
        for(var i=0;i<4;i++){
            if(curPattern.pattern[i]!=0){
                var matches=/([^0]+)/.exec(curPattern.pattern[i].toString(2));
                var x=12-matches.input.length;
                var y=curPattern.y+i;
                for(var j=0;j<matches[0].length;j++){
                    radiusRect(context,(x+j)*(T+1),y*(T+1),T,5,"#ff8c00");
                }
            }
        }
    }

    /**
     * 绘制下一个图形
     * @param c
     */
    function drawNext(c){
        c.clearRect(nextArea.x+T,nextArea.y+T,nextArea.w-2*T,nextArea.h-2*T);
        var p;
        for(var i=0;i<4;i++){

            p=nextPattern[i].toString(2);
            // console.log(p);
            var n=3;

            for(var j=p.length;j>0;j--){
                // console.log(n);

                if(p[j-1]==1){
                    radiusRect(c,nextArea.x+(n+1)*(T+1),nextArea.y+(i+1)*(T+1),T,5,"red")
                }
                // radiusRect(c,nextArea.x+(n+1)*(T+1),nextArea.y+(i+1)*(T+1),T,5,"red")
                n--;
            }
        }
    }
    
    /**
     * 游戏区域绘制边框
     * @param c
     */
    function drawBorder(c){
        c.save();
        c.fillStyle="#2f4f4f";
        c.fillRect(gameArea.x,gameArea.y,gameArea.w,gameArea.h);
        c.fillRect(nextArea.x,nextArea.y,nextArea.w,nextArea.h);
        c.fillRect(scoreArea.x,scoreArea.y,scoreArea.w,scoreArea.h);
        c.restore();
    }

    function drawScore(c){
        c.clearRect(scoreArea.x+T,scoreArea.y+T,scoreArea.w-T*2,scoreArea.h-T*2)
        c.save();
        c.fillStyle="#f00";
        c.font="20px Arial";
        c.fillText("Score:"+score,scoreArea.x+T,scoreArea.y+T+50)
    }
    /**
     * 绘制圆角矩形
     * @param c 绘图对象
     * @param x x坐标
     * @param y y坐标
     * @param w 矩形宽度
     * @param r 圆角半径
     */
    function radiusRect(c,x,y,w,r,s){
        c.save();
        c.fillStyle=s;
        c.beginPath();
        c.moveTo(x+r,y);
        c.lineTo(x+w-r,y);
        c.arc(x+w-r,y+r,r,1.5*Math.PI,2*Math.PI);
        c.lineTo(x+w,y+w-r);
        c.arc(x+w-r,y+w-r,r,0,0.5*Math.PI);
        c.lineTo(x+r,y+w);
        c.arc(x+r,y+w-r,r,0.5*Math.PI,1*Math.PI);
        c.lineTo(x,y+r);
        c.arc(x+r,y+r,r,1*Math.PI,1.5*Math.PI);
        c.closePath();
        c.fill();
        c.restore();
    }
    /**
     * 向下移动
     */
    function down(){
        //方块y坐标加1
        ++curPattern.y;
        //碰撞处理
        if(isCrash()){
            //消行
            var line=0;
            for(var i = 0; i < 4 && curPattern.y + i < 22; i++) {
                //和实体场景进行位或并且赋值，如果最后赋值结果为0xfff，也就说明当前行被完全填充了，可以消行
                if((map[curPattern.y + i] |= curPattern.pattern[i]) == 0xfff) {
                    line++;
                    //行删除
                    map.splice(curPattern.y + i, 1);
                    //首行添加
                    map.unshift(0x801);
                }
            }
            switch (line){
                case 1:score+=100;break;
                case 2:score+=200;break;
                case 3:score+=400;break;
                case 4:score+=800;break;
                default:break;
            }
            drawScore(context);
            //如果最上面一行不是空了，俄罗斯方块垒满了，则游戏结束
            if(map[1] != 0x801) {
                return over();
            }
            //这里重新产生下一个俄罗斯方块
            start();
        }
        //更新
        update();
    }
    /**
     * 左右移动
     * @param t 控制图案移动
     * @param k 位移距离
     */
    function move(t,k){
        curPattern.x += k;
        for(var i = 0; i < 4; i++) {
            //t=2左移，t=0.5,右移
            curPattern.pattern[i] *= t;
        }
        //更新
        update(isCrash());
    }
    /**
     * 游戏结束
     */
    function over(){
        //撤销onkeydown的事件关联
        document.onkeydown = null;
        //清理定时器
        clearInterval(run);
        alert("游戏结束");
    }
    /**
     * 绑定键盘事件
     * @param e
     */
    document.onkeydown = function(e) {
        eval( keyDown[(e ? e : event).keyCode] );
    };
    document.getElementById("stop").onclick=function () {
      clearInterval(run);
    };
    document.getElementById("start").onclick=function () {
        console.log(run);
        if(!run){
            run=setInterval(function () {
                down();
            },300)
        }

    };
    drawBorder(context);
    drawScore(context);
    start();
}(document.getElementById("canvas")));