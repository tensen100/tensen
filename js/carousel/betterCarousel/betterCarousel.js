const BetterCarousel = (() => {
    // 动画类型
    const ANIMATION_TYPE = {
        leave: 'leave', // 离开
        enter: 'enter', // 进入
    };

    // 动画方向
    const ANIMATION_DIRECTION = {
        next: 'front', // 下一页/向前
        prev: 'back', // 上一页/向后
    };

    // class name
    const CLONE_CONTAINER_CLASS_NAME = 'carousel-clone';
    const CLONE_ITEM_CLASS_NAME = 'carousel-clone-item';
    const CLONE_CONTENT_CLASS_NAME = 'carousel-clone-content';


    //function

    // 显示元素
    const show = el => el.style.display = 'block';

    // 隐藏元素
    const hide = el => el.style.display = 'none';

    // 添加class
    const addClass = (el, className) => {
        const classList = el.className.split(' ');
        if (classList.includes(className)) {
            return ;
        }
        classList.push(className);
        el.className = classList.join(' ')
    };

    // 删除class
    const removeClass = (el, className) => {
        const classList = el.className.split(' ');
        const idx = classList.indexOf(className);
        if (idx > -1) {
            classList.splice(idx,1)
        }
        el.className = classList.join(' ')
    };

    // 设置dom style
    const setStyle = (el, style) => {
        for (let i in style) {
            if (style.hasOwnProperty(i)) {
                el.style[i] = style[i]
            }
        }
        return el;
    };

    // 将数字转换为带单位的字符串
    const setUnit = (number, unit) => {
        return number + (unit || 'px')
    };


    class BetterCarousel{
        constructor(options) {
            this.container = options.container;
            this.content = options.content;
            this.list = options.list;
            this.nextBtn = options.nextBtn;
            this.prevBtn = options.prevBtn;
            this.row = options.row || 1;
            this.col = options.col || 1;
            this.animate = Array.isArray(options.animate) ? options.animate : [options.animate];
            this.init();
            this.bind();
        }
        // 初始化
        init() {
            const me = this;
            me.runAnimations = 0; // 正在运行动画数量
            me.index = 0; // 当前显示页数
            me.length = me.list.length; // 总页数
            show(me.list[me.index]) // 默认显示第一页
        }

        // 绑定事件
        bind() {
            const me = this;
            me.nextBtn.onclick = function(){
                me.next();
            };
            me.prevBtn.onclick = function(){
                me.prev();
            };
        }

        // 上一页
        prev () {
            const me = this;

            // 如果当前是第一页，跳转到最后一页
            const idx = me.index === 0 ? me.length-1 : me.index-1;
            me.skip(idx, ANIMATION_DIRECTION.prev)
        }

        // 下一页
        next () {
            const  me = this;
            // 如果当前是最后一页，跳转到第一页
            const idx = me.index === me.length-1 ? 0 : me.index+1 ;
            me.skip(idx, ANIMATION_DIRECTION.next)
        }

        // 跳转到指定页
        skip (idx, direction) {
            // 如果还有正在运行的动画
            if (this.runAnimations) {
                return;
            }
            const me = this;
            me.beforeCarousel();
            const next = me.list[idx]; //下一页
            const cur = me.list[me.index]; // 当前页

            if (!direction) {
                direction = idx > me.index ? ANIMATION_DIRECTION.next : ANIMATION_DIRECTION.prev;
            }
            if (me.row === 1 && me.col === 1) {
                me.runAnimal(cur, ANIMATION_TYPE.leave, direction, me.animate[0]);
                me.runAnimal(next, ANIMATION_TYPE.enter, direction, me.animate[0]);
            } else {
                me.split(cur,next, ({newCur, newNext,row,col}) => {

                    const animalName = me.getAnimalName(row,col);
                    console.log(row, col,animalName);
                    me.runAnimal(newCur, ANIMATION_TYPE.leave, direction, animalName);
                    me.runAnimal(newNext, ANIMATION_TYPE.enter, direction, animalName);
                });
            }
            me.index = idx;
        }
        getAnimalName(row, col){
            const animals = this.animate;
            if (animals.length === 1) {
                return animals[0]
            } else {
                const animalRows = animals[row];
                return Array.isArray(animalRows) ? animalRows[col] : animalRows
            }
        }

        // 运行动画
        runAnimal(el, type, direction, name) {
            const me = this;
            me.runAnimations ++;
            const className = `${name}-${direction}-${type}`;
            const classNameTo = `${className}-to`;
            const classNameActive = `${className}-active`;
            addClass(el, className);
            addClass(el, classNameActive);

            if (type === ANIMATION_TYPE.enter) {
                show(el);
            }
            const transitionEndHandler = function () {
                removeClass(el, classNameActive);
                removeClass(el, classNameTo);
                if (type === ANIMATION_TYPE.leave ) {
                    hide(el);
                }
                me.runAnimations --;
                if (me.runAnimations === 0) {
                    me.afterAnimate()
                }
                el.removeEventListener('transitionend', transitionEndHandler)
            };
            el.addEventListener('transitionend', transitionEndHandler );
            setTimeout(() => {
                removeClass(el, className);
                addClass(el, classNameTo);
            }, 20);
        }

        // 分割轮播图
        split(cur, next,callback) {
            const me = this;
            const row = me.row; // 行数
            const col = me.col; // 列数
            const containerWidth = this.container.offsetWidth;
            const containerHeight = this.container.offsetHeight;
            const itemWidth = containerWidth / col;
            const itemHeight = containerHeight / row;
            me.curElement = cur;
            me.nextElement = next;

            const cloneContainer = me.createElement({
                className: CLONE_CONTAINER_CLASS_NAME,
            });
            this.cloneContainer = cloneContainer;

            const splitList = [];
            for (let r = 0; r < row; r++) {
                const splitRows = [];
                for(let c = 0; c < col; c++) {
                    const cloneItem = me.createElement({
                        className: CLONE_ITEM_CLASS_NAME,
                        style: {
                            width: setUnit(itemWidth),
                            height: setUnit(itemHeight),
                            left: setUnit(c * itemWidth),
                            top: setUnit(r * itemHeight),
                        }
                    });

                    const newStyle = {
                        width: setUnit(containerWidth),
                        height: setUnit(containerHeight),
                        left: setUnit(- c * itemWidth),
                        top: setUnit(- r * itemHeight),
                    };
                    const newNext = me.createWrapper(next, newStyle);
                    const newCur = me.createWrapper(cur, newStyle);

                    splitRows.push({newNext,newCur});

                    cloneItem.appendChild(newCur);
                    cloneItem.appendChild(newNext);

                    cloneContainer.appendChild(cloneItem)
                }
                splitList.push(splitRows)
            }
            me.container.appendChild(cloneContainer);
            setTimeout(() => {
                me.beforeAnimate();
                splitList.forEach( (list ,rowIndex) => {
                    list.forEach( (item, colIndex) => callback({...item,row: rowIndex,col: colIndex}));
                })
            }, 1)
        }

        // 创建dom
        createElement({tag, className, style}) {
            const me = this;
            tag = tag || 'div';
            const el = document.createElement(tag);
            if (className) {
                el.className = className
            }
            if (style) {
                setStyle(el, style)
            }
            return el;
        }

        // 创建包裹元素
        createWrapper (el, style) {
            const me = this;
            el = el.cloneNode(true);
            const display = el.style.display;
            el.style.display = 'block';
            const wrapper = me.createElement({
                className: CLONE_CONTENT_CLASS_NAME,
                style: {
                    display
                }
            });

            wrapper.appendChild(setStyle(el, style));
            return wrapper;
        }

        // 滚动开始之前
        beforeCarousel(curIndex, nextIndex) {
            console.log('beforeCarousel');
        }

        // 分割完成，动画开始之前
        beforeAnimate() {
            console.log('beforeAnimate');
            const me = this;
            hide(me.curElement);
        }

        // 动画结束之后， clone 的dom还未清除
        afterAnimate () {
            console.log('afterAnimate');
            const me = this;
            setTimeout(() => {
                if (me.nextElement){
                    show(me.nextElement);
                }
                this.afterCarousel()
            }, 1);

        }

        // 滚动结束之后
        afterCarousel (curIndex, lastIndex) {
            console.log('afterCarousel');
            const me = this;
            setTimeout(() => {
                if (me.cloneContainer) {
                    me.cloneContainer.remove();
                    me.cloneContainer = null;
                }
            },1);

        }
    }

    return BetterCarousel
})();