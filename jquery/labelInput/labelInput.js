(function ($) {
    var SearchInput = (function () {
        function SearchInput(element, options) {
            // 存放配置参数
            this.settings = $.extend(true,$.fn.SearchInput.defaults,options || {});
            this.element = element;
            this.init();
        }
        SearchInput.prototype = {
            // 插件初始化
            init:function () {
                var me = this;
                me.selectors = me.settings.selectors;
                me.input = me.element.find(me.selectors.title).find("input");
                me.result = me.element.find(me.selectors.result);
                me.tips = me.element.find(me.selectors.tips);
                /*me.renderTips(me.settings.defaultValue);
                me._showTips();
                me._initEvent()*/
            },
            // 渲染tips
            renderTips: function (rows) {
                if($.type(rows) === "array" && rows.length !== 0){
                    var html = "";
                    $.each(rows,function (i,v) {
                        html += " <span class='layui-badge layui-bg-gray'>"+ v +"</span>"
                    });
                    this.tips.html(html)
                }

            },
            // 显示Tips
            _showTips: function () {
                this.tips.fadeIn("100")
            },
            // 隐藏Tips
            _hiddenTips: function () {
                this.tips.fadeOut("100")
            },

            // 渲染结果
            renderKey: function (rows) {
                var me = this;
                if($.type(rows) === "array" && rows.length !== 0){
                    var html = "";
                    $.each(rows, function (i, v) {
                        html += "<dd>"+ v +"</dd>"
                    });
                    me.result.html(html);
                    me.element.addClass(me.settings.showResultClass)
                }else{
                    me.element.removeClass(me.settings.showResultClass)
                }

            },
            // 初始化事件
            _initEvent: function () {
                var me = this;
                // 点击默认值
                me.tips.on("click","span",function () {
                    var txt = $(this).text();
                    me.input.val(txt);
                    me._hiddenTips();
                    me.settings.search(txt)
                });
                // 输入框
                me.input.keyup(function (e) {
                    // 清除定时器
                    if(me.timeOut){
                        clearTimeout(me.timeOut)
                    }
                    e = e || window.e;
                    var txt = $(this).val().trim();
                    // 判断输入框内容是否为空
                    if(!txt.trim()){
                        me._showTips();
                        me.renderKey([]);
                        return;
                    }

                    // 是否按下回车
                    if(e.keyCode === 13){
                        // 按下回车直接搜索
                        me.settings.search(txt);
                        me.renderKey([]);
                        return;
                    }
                    // 0.5s 后开始搜索
                    me.timeOut = setTimeout(function () {
                        me._hiddenTips();
                        me.settings.search(txt);
                        me.settings.keyChanges(txt)
                    },500);
                });
                // 选中下拉框
                me.result.on("click","dd" , function () {
                    var txt = $(this).text();
                    me.input.val(txt);
                    me.settings.search(txt);
                    me.renderKey([])
                })
            }
        };
        return SearchInput;
    })();

    $.fn.SearchInput = function (options,data) {
        console.log(options);
        //实现链式调用
        return this.each(function(){
            console.log(123);
            var me = $(this),
                // 插件的实例
                instance = me.data("SearchInput");
            // 单列模式

            if(!instance){
                instance = new SearchInput(me,options);
                me.data("SearchInput",instance)
            }
            if($.type(options) === "string") return instance[options](data);
        });
    };
    // 默认参数
    $.fn.SearchInput.defaults = {
        //存放插件的基本元素
        selectors : {
            title : ".search-input-title",
            result : ".search-input-result",
            tips : ".search-input-tips"
        },
        showResultClass: "layui-form-selected",
        defaultValue: [], // 默认值
        keyChanges: "", // 输入框值改变时调用
        search: "" // 搜索时调用
    }
})(jQuery);