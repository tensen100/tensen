
(function ($) {
    //定义PageSwitch对象
    var PageSwitch = (function () {
        function PageSwitch(element, options) {
            //存放配置参数
            //jQuery的extends方法将用户自定义的插件参数与插件的默认参数合并
            this.settins = $.extend(true,$.fn.PageSwitch.default,options || {});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            init : function () {

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
    $.fn.PageSwitch.default = {
        selectors : {
            sections : ".sections",
            section : ".section",
            page : ".pages",
            active : ".active"
        },
        index : 0,
        easing :"ease",
        duration : 500,
        loop : false,//是否可以循环播放
        pagination : true,//是否进行分页处理
        keyboard : true,//是否触发键盘事件
        direction : "vertical",//滑动方向
        callback : ""//回调函数
    }
})(jQuery);