var Local = function () {
    // 游戏对象
    let game;
    
    // 绑定事件
    let bindEvent = function () {
      document.onkeydown = function (e) {
          switch (e.keyCode) {
              case 38: // up
                  break;
              case 39: // right
                  game.right();
                  break;
              case 40:// down
                  game.down();
                  break;
              case 37:// left
                  game.left();
                  break;
              case 32:// space
                  break;
          }
      }  
    };
    // 开始
    let start = function () {
        let doms = {
            gameDiv:document.getElementById('game'),
            nextDiv:document.getElementById('next')
        };
        game = new Game();
        game.init(doms);
        bindEvent();
    };
    // 导出
    this.start = start;
};