var SquareFactory = (function () {
    var squares = [
        [0x6600],
        [0x2222, 0x0f00],
        [0xc600, 0x2640],
        [0x6c00, 0x4620],
        [0x4460, 0x2e0, 0x6220, 0x740],
        [0x2260, 0x0e20, 0x6440, 0x4700],
        [0x2620, 0x720, 0x2320, 0x2700]
    ];
    let getSquare = function () {
        return new Square(squares[Math.floor(Math.random() * 7)])
    };
    return {getSquare: getSquare()}
})();
