/**
 * 单例模式
 * 如果实例存在则不再重新创建实例
 * 利用data()来存放插件实例
 * @constructor
 */
// $.fn.MyPlugin = function(){
//     var me = $(this),
//         instance = me.data("myPlugin");
//     if(!instance){
//         me.data("myPlugin",(instance = new myPlugin()));
//     }
// };

(function ($) {
    /**
     * 获取浏览器前缀
     * 判断某个元素中是否存在transition属性
     * 有则返回前缀，否则返回false
     */
    var _prefix = (function(temp){

        var aPrefix = ["webkit","Moz","o","ms"],
            props="";
        for(var i in aPrefix){
            props = aPrefix[i]+"Transition";
            if(temp.style[props] != undefined){
                return "-"+aPrefix[i].toLowerCase()+"-";
            }
        }
        return false;
    })(document.createElement(PageSwitch));

    //定义PageSwitch对象
    var PageSwitch = (function () {
        function PageSwitch(element, options) {
            //存放配置参数
            //jQuery的extends方法将用户自定义的插件参数与插件的默认参数合并
            this.settings = $.extend(true,$.fn.PageSwitch.defaults,options || {});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            /**
             * 初始化插件
             * 初始化dom结构，布局，分页及绑定事件
             */
            init : function () {
                console.log("初始化开始--------------");
                var me = this;
                //文档结构初始化
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.sections.find(me.selectors.section);

                //配置属性初始化
                //页面滑动方向
                me.direction = me.settings.direction == "vertical" ? true:false;
                //页面数量
                me.pagesCount = me.pagesCount();
                //起始页
                me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index :0;

                me.canScroll = true;

                //如果不是纵向布局，初始化布局
                if(!me.direction){
                    me._initLayout()
                }
                //初始化分页
                if(me.settings.pagination){
                    me._initPaging()
                }
                //绑定事件
                me._initEvent();
                console.log("初始化结束--------------");


            },

            /**
             * 获取滑动页面数量
             */
            pagesCount : function () {
                return this.section.length;
            },
            /**
             * 获取滑动的宽度或高度
             */
            switchLength : function () {
                return this.direction ? this.element.height() : this.element.width();
            },

            /**
             * 前一页
             */
            prev : function () {
                var me = this;
                if(me.index>0){
                    me.index--;
                }else if(me.settings.loop){
                    me.index = me.pagesCount-1;
                }
                me._scrollPage();
            },

            /**
             * 下一页
             */
            next : function () {
                var me = this;
                if(me.index < me.pagesCount){
                    me.index++;
                }else if(me.settings.loop){
                    me.index = 0;
                }
                me._scrollPage();
            },

            /**
             * 主要针对横屏情况进行页面布局
             */
            _initLayout : function () {
                var me = this;
                var width = (me.pagesCount * 100) + "%",
                    cellWidth = (100/me.pagesCount).toFixed(2)+"%";
                me.sections.width(width);
                me.section.width(cellWidth).css("float","left");
            },

            /**
             * 实现分页的dom结构及css样式
             */
            _initPaging : function () {
                var me = this,
                    pagesClass = me.selectors.page.substring(1);
                    me.activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class="+pagesClass+">";
                for(var i=0;i<me.pagesCount;i++){
                    pageHtml+="<li></li>"
                }
                pageHtml+="</ul>";
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if(me.direction){
                    pages.addClass("vertical");
                }else {
                    pages.addClass("horizontal");
                }

            },

            /**
             * 初始化插件事件
             */
            _initEvent : function () {
                var me = this;
                //分页事件
                me.element.on("click",me.selectors.page+" li",function () {
                    me.index = $(this).index();
                    me._scrollPage();
                });
                //鼠标滚轮事件
                me.element.on("mousewheel DOMMouseScroll",function (e) {
                    e.preventDefault();
                    if(me.canScroll){
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                        if(delta > 0 && (me.index && !me.settings.loop || me.settings.loop)){
                            console.log("上一页");
                            me.prev();
                        }else if(delta < 0 && (me.index < (me.pagesCount -1)&& !me.settings.loop || me.settings.loop)){
                            console.log("下一页");
                            me.next();
                        }
                    }
                });
                //键盘事件
                if(me.settings.keyboard){
                    $(window).on("keydown",function(e){
                        var keyCode = e.keyCode;
                        if(keyCode == 37 || keyCode == 38){
                            me.prev();
                        }else if(keyCode == 39 || keyCode == 40){
                            me.prev()
                        }
                    })
                }

                //改变窗口大小事件
                $(window).resize(function () {
                    var currentLength = me.switchLength(),
                        offset = me.settings.direction ?me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left
                    if(Math.abs(offset) > currentLength/2 && me.index < (me.pagesCount -1)){
                        me.index++;
                    }
                    if(me.index){
                        me._scrollPage();
                    }
                });
                //transitionend
                me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend",function(){
                    me.canScroll = true;
                    if(me.sections.callback && $.type(me.settings.callback) == "function"){
                        me.settings.callback();
                    }
                })

            },

            /**
             * 滑动动画
             */
            _scrollPage : function () {
                console.log("滑动动画");
               var me = this,
                   dest = me.section.eq(me.index).position();
                if(!dest) return ;
                me.canScroll = false;

                if(_prefix){
                    var translate = me.direction ? "translateY(-"+dest.top+"px)" : "translateX(-"+dest.left+"px)";
                    me.sections.css(_prefix + "transition","all " + me.settings.duration + "ms "+me.settings.easing);
                    me.sections.css(_prefix+"transform",translate);
                }else{
                    var animateCss = me.direction ? {top : -dest.top}:{left:-dest.left};
                    me.sections.animate(animateCss,me.sections.duration,function () {
                        me.canScroll = true;
                        if(me.sections.callback && $.type(me.settings.callback) == "function"){
                            me.settings.callback();
                        }
                    })
                }
                if(me.settings.pagination){
                    me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass)
                }
            }
        };
        return PageSwitch;
    })();
    //传入用户配置的参数
    $.fn.PageSwitch = function (options) {
        //实现链式调用
        return this.each(function(){
            var me = $(this),
                //插件的实例
                instance = me.data("PageSwitch");
            if(!instance){
                instance = new PageSwitch(me,options);
                me.data("PageSwitch",instance)
            }
            if($.type(options) === "string") return instance[options]();
        });
    };
    //默认配置参数
    $.fn.PageSwitch.defaults = {
        //存放插件的基本元素
        selectors : {
            sections : ".sections",
            section : ".section",
            page : ".pages",
            active : ".active"
        },
        index : 0,//页面开始的索引
        easing :"ease", //动画效果
        duration : 500, //动画执行时间
        loop : false,//是否可以循环播放
        pagination : true,//是否进行分页处理
        keyboard : true,//是否触发键盘事件
        direction : "vertical",//滑动方向horizontal 
        callback : ""//回调函数
    }
})(jQuery);