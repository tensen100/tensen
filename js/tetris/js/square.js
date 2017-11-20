/*var Square = function () {
    // 方块数据
    this.data = [
        [0,0,2,0],
        [0,0,2,0],
        [0,0,2,0],
        [0,0,2,0]
    ];
    // 原点
    this.origin = {
        x:2,
        y:0
    };
    // 旋转数组
    this.roates = [
        [
            [0,0,2,0],
            [0,0,2,0],
            [0,0,2,0],
            [0,0,2,0]
        ],
        [
            [0,0,0,0],
            [2,2,2,2],
            [0,0,0,0],
            [0,0,0,0]
        ]
    ];
    // 旋转位置
    this.direction = 0;
};*/

var Square = function () {
    // 方块数据
    this.data = [
        [
            [0,0,2,0],
            [0,0,2,0],
            [0,0,2,0],
            [0,0,2,0]
        ],
        [
            [0,0,0,0],
            [2,2,2,2],
            [0,0,0,0],
            [0,0,0,0]
        ]
    ];
    // 方块位置
    this.x = 0;
    this.y = 0;
    // 旋转方向
    this.direction = 0;
    //初始化
    this.init();
};
/**
 * 初始化方块
 */
Square.prototype.init = function () {
    this.length = this.data.length;
    // 随机旋转
    this.rotate(Math.floor(Math.random()*this.length))
    this.backup();
};

/**
 * 备份方块
 */
Square.prototype.backup = function () {
    this.backupData = {
        x:this.x,
        y:this.y,
        direction:this.direction,
        pattern:this.pattern,
    }
};

/**
 * 恢复备份
 */
Square.prototype.restoreBackup = function () {
    let backupData = this.backupData;
    this.x = backupData.x;
    this.y = backupData.y;
    this.direction = backupData.direction;
    this.pattern = backupData.pattern;
};

/**
 * 旋转方块
 * @param n
 */
Square.prototype.rotate = function (n) {
    let direction = this.direction;
    this.direction = (direction + n) % this.length;
    this.pattern = this.data[direction];
};

