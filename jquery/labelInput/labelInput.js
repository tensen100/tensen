(function ($) {
    var LabelInput = (function () {
        function LabelInput(element, options) {
            // 存放配置参数
            this.settings = $.extend(true,$.fn.LabelInput.defaults,options || {});
            this.element = element;
            this.init();
        }
        LabelInput.prototype = {
            /**
             *  插件初始化
             */
            init:function () {
                var me = this;
                var selectors = me.settings.selectors;
                me.selectBox = me.element.find(selectors.title);
                me.input = me.element.find(selectors.title).find('input');
                me.result = me.element.find(selectors.result);
                me.defaultTips = me.element.find(selectors.defaultTips);
                me.selectedTips = me.element.find(selectors.selectedTips);
                me.addBtn = me.element.find(selectors.addBtn);
                me.clearBtn = me.element.find(selectors.clearBtn);
                me.searchCondition = []; // 搜索条件数组
                me.renderDefaultTips(me.settings.defaultLabel);
                me._initEvent();
            },

            /**
             * 渲染默认tips
             * @param rows:array 渲染的内容
             */
            renderDefaultTips: function (rows) {
                var me = this;
                if($.type(rows) === 'array' && rows.length !== 0){
                    var html = '';
                    $.each(rows,function (i,v) {
                        html += ' <span class="layui-badge layui-bg-gray" data-idx="'+ i +'" >'+ me._analysisPath(v) +'</span>';
                    });
                    me.defaultTips.html(html);
                }

            },

            /**
             * 添加一个搜索条件
             * @param condition: string 文本信息
             * @param type: string 类型 defaultValue,key
             */
            addCondition: function (condition) {
                var me = this;
                for(var i = 0, value; value = me.searchCondition[i++];) {
                    if(me._analysisPath(value) === me._analysisPath(condition)) {
                        return;
                    }
                }
                me.searchCondition.push(condition);
                me.refreshSelectedTips();
                me.search();
            },

            /**
             * 删除一个搜索条件
             * @param idx 在数组中的位置
             */
            removeCondition: function (idx) {
                var me = this;
                me.searchCondition.splice(idx, 1);
                me.refreshSelectedTips();
                me.search();
            },

            /**
             * 更新已选中的搜索条件
             */
            refreshSelectedTips: function () {
                var me = this;
                if(me.searchCondition.length === 0){
                    me.selectBox.css('width','100%');
                    me.selectedTips.hide();
                    return;
                }
                var html = '';
                $.each(me.searchCondition, function (i, v) {
                    html += '<span class="my-badge" data-idx="'+ i +'">'+ me._analysisPath(v) + '<i class="icon layui-icon">&#x1006;</i></span>';
                });
                this.selectedTips.html(html);
                me.selectBox.css('width','65%');
                setTimeout(function () {
                    me.selectedTips.show();
                },300);
            },

            /**
             * 渲染下拉框
             * @param rows:array 渲染的内容
             */
            renderKey: function (rows) {
                var me = this;
                if($.type(rows) === 'array' && rows.length !== 0){
                    var html = '';
                    $.each(rows, function (i, v) {
                        html += '<dd data-idx="'+ i +'">'+ me._analysisPath(v) +'</dd>';
                    });
                    me.result.html(html);
                    me.element.addClass(me.settings.showResultClass);
                    me.keyRows = rows; // 保存在对象中供返回使用
                }else{
                    me.element.removeClass(me.settings.showResultClass);
                }

            },

            /**
             * 触发搜索事件
             */
            search: function () {
                var me = this;
                me.settings.search(me.searchCondition);
            },

            /**
             * 解析默认值对象路径
             * @param obj 要解析的对象
             * @param type 类型 defaultValue/keys
             * @returns {string} 返回要显示的文本
             * @private
             */
            _analysisPath: function (obj) {
                if($.type(obj) === 'string') return obj;
                var tem = obj;
                $.each(this.settings.labelPath, function (i, n) {
                    tem = tem[n];
                });
                return tem;
            },

            /**
             * 给默认的tips绑定事件
             * @private
             */
            _bindDefaultTips: function () {
                var me = this;
                me.defaultTips.on('click', 'span', function () {
                    me.addCondition(me.settings.defaultLabel[$(this).data('idx')]);
                });
            },

            /**
             * 给选中的tips 绑定事件
             * @private
             */
            _bindSelectedTips: function () {
                var me = this;
                me.selectedTips.on('click','span > i', function () {
                    me.removeCondition($(this).parent().data('idx'));
                });
            },

            /**
             * 给输入框绑定事件
             * @private
             */
            _bindInput: function () {
                var me = this;
                me.input.keyup(function (e) {
                    // 清除定时器
                    if(me.timeOut){
                        clearTimeout(me.timeOut);
                    }
                    e = e || window.e;
                    var txt = $(this).val().trim();
                    // 判断输入框内容是否为空
                    if(!txt.trim()){
                        me.renderKey([]);
                        return;
                    }

                    // 是否按下回车
                    if(e.keyCode === 13){
                        return;
                    }
                    // 0.5s 后开始搜索
                    me.timeOut = setTimeout(function () {
                        me.settings.keyChanges(txt);
                    },500);
                });
            },

            /**
             * 给按钮绑定事件
             * @private
             */
            _bindHandle: function () {
                var me = this;
                me.addBtn.click(function () {
                    var labelPath = me.settings.labelPath;
                    var length = labelPath.length;
                    var obj = {};
                    var tem = obj;
                    $.each(labelPath, function (i,v) {
                        if(i === length-1){
                            tem[v] = me.input.val();
                        }else{
                            tem = tem[v] = {};
                        }
                    });
                    me.addCondition(obj);
                    me.renderKey([]);
                });
                me.clearBtn.click(function () {
                    me.input.val('');
                    me.renderKey([]);
                });
            },

            /**
             * 给下拉框绑定事件
             * @private
             */
            _bindSelected: function () {
                var me = this;
                me.result.on('click','dd' , function () {
                    var ele = $(this);
                    me.addCondition(me.keyRows[ele.data('idx')], 'key');
                    me.renderKey([]);
                });
            },

            /**
             * 初始化事件
             * @private
             */
            _initEvent: function () {
                var me = this;
                me._bindDefaultTips();
                me._bindSelectedTips();
                me._bindInput();
                me._bindHandle();
                me._bindSelected();
            }
        };
        return LabelInput;
    })();

    $.fn.LabelInput = function (options,data) {
        //实现链式调用
        return this.each(function(){
            var me = $(this),
                // 插件的实例
                instance = me.data('LabelInput');
            // 单列模式
            if(!instance){
                instance = new LabelInput(me,options);
                me.data('LabelInput',instance);
            }
            if($.type(options) === 'string') return instance[options](data);
        });
    };
    // 默认参数
    $.fn.LabelInput.defaults = {
        //存放插件的基本元素
        selectors : {
            title : '.label-input-select',
            result : '.label-input-result',
            defaultTips : '.label-input-default-tips',
            selectedTips : '.label-input-selected-tips',
            clearBtn: '.clear-btn',
            addBtn: '.add-btn'
        },
        showResultClass: 'layui-form-selected',
        showSelectedTipsClass: 'tip-select-show',
        defaultLabel: [], // 默认值
        labelPath: [], // 默认值路径
        keyChanges: '', // 输入框值改变时调用
        search: '' // 搜索时调用
    };
})(jQuery);