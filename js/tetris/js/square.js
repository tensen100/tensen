var Square = function (squares) {
    this.init(squares);
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
    }
};
Square.prototype.init = function () {
    this
};
Square.prototype.rotate = function () {

};