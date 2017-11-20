var Local = function () {
    // 游戏对象
    let game;
    
    // 绑定事件
    let bindEvent = function () {
      document.onkeydown = function (e) {
          switch (e.keyCode) {
              case 38: // up
                  game.rotate();
                  break;
              case 39: // right
                  game.move(1);
                  break;
              case 40:// down
                  game.down();
                  break;
              case 37:// left
                  game.move(-1);
                  break;
              case 32:// space
                  game.fall()
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