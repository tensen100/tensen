const toUpperCase = x => x.toUpperCase();
const exclaim = x => x+'!';

/**
 * 函数组合,从后往前执行
 * 结合律 compose(f, compose(g, h)) == compose(compose(f, g), h);
 * @param f
 * @param g
 */
const composer = (f,g) => x => f(g(x));

// 使用
const shout = composer(exclaim, toUpperCase);

console.log(shout('send in the clowns'));

