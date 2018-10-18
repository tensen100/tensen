/**
 * 修复事件对象
 * @param event
 * @returns {*}
 */
const fixEvent = (event) => {
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }

  if ( !event || !event.stopPropagation ) {
    const old = event || window.event;

    // 克隆属性
    event = {};
    for ( let prop in old) {
      event[prop] = old[prop];
    }

    // 修复时间原始源
    if (!event.target) {
      event.target = event.srcElement || document
    }

    // 事件触发时的关联元素
    event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

    // 阻止默认行为的发生， ？IE中不存在
    event.preventDefault = function () {
      event.returnValue = false;
      event.isDefaultPrevented = returnTrue;
    };

    event.isDefaultPrevented = returnFalse;

    // 阻止事件冒泡， IE中部存在
    event.stopPropagation = function () {
      event.cancelBubble = true;
      event.isPropagationStopped = returnTrue;
    };
    event.isPropagationStopped = returnFalse;

    event.stopImmediatePropagation = function () {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    };
    event.isImmediatePropagationStopped = returnFalse;

    // 鼠标相对文档的位置 IE中部存在
    if ( event.clientX != null) {
      var doc = document.documentElement, body = document.body;
      event.pageX = event.clientX +
        ( doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        ( doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
        ( doc && doc.scrollTop || body && body.scrollTop || 0) -
        ( doc && doc.clientTop || body && body.clientTop || 0);
    }

    // 键盘事件时所按键的键盘码
    event.which = event.charCode || event.keyCode;

    // 鼠标事件发生时位掩码
    // IE中1左单击，2右单击 4中间单击
    // DOM Model中 012
    if (event.button !== null) {
      event.button = (event.button & 1 ? 0 :
        (event.button & 4 ? 1:
          (event.button & 2 ? 2 : 0)));
    }
  }
  return event
};

// 实现一个中央对象保存元素信息
(() => {
  const cache ={};
  const expando = 'data' + Date.now();
  let guidCounter = 1;

  this.getData = (elem) => {
    let guid = elem[expando];
    if (!guid) {
      guid = elem[expando] = guidCounter++;
      cache[guid] = {}
    }
    return cache[guid];
  };

  this.removeData = (elem) => {
    const guid = elem[expando];
    if (!guid) return;
    delete cache[guid];
    try {
      delete elem[expando];
    } catch (e) {
      if (elem.removeAttribute) {
        elem.removeAttribute(expando);
      }
    }
  }
})();

// 绑定事件处理程序并进行跟踪的函数
(()=>{
  let nextGuid = 1;

  /**
   * 绑定事件
   * @param elem
   * @param type
   * @param fn
   */
  this.addEvent = (elem, type, fn) => {

    // 获取相关数据
    const data = getData(elem);

    // 创建处理程序的存储
    if ( !data.handlers) data.handlers = {};

    // 使用type创建该type对应的数组
    if ( !data.handlers[type]) data.handlers[type] = [];

    // 标记函数
    if (!fn.guid) fn.guid = nextGuid++;

    // 将事件处理程序添加到列表中
    data.handlers[type].push(fn);

    // 创建事件调度器
    if (!data.dispatcher) {
      data.disabled = false;
      data.dispatcher = function (event) {
        if (data.disabled) return;
        event =  fixEvent(event);

        // 调用注册的处理程序
        const handlers = data.handlers[event.type];
        if (handlers) {
          for (let n = 0; n < handlers.length;n++) {
            handlers[n].call(elem, event)
          }
        }
      };
    }

    // 注册调度器
    if ( data.handlers[type].length === 1) {
      if (document.addEventListener) {
        elem.addEventListener(type, data.dispatcher, false)
      } else if (document.attachEvent) {
        elem.attachEvent('on' + type, data.dispatcher)
      }
    }
  };

  /**
   * 删除绑定事件
   * @param elem
   * @param type
   * @param fn
   */
  this.removeEvent = (elem, type, fn) => {
    const data = getData(elem);

    if (!data.handlers) return;

    const removeType = (t) => {
      data.handlers[t] = [];
      tidyUp(elem,t);
    };

    // 删除所有处理程序
    if (!type) {
      for ( let t in data.handlers) removeType(t);
      return;
    }

    const handlers = data.handlers[type];
    if (!handlers) return;

    // 删除一个特定type的所有程序
    if (!fn) {
      removeType(type);
      return;
    }

    // 删除一个特定的处理程序
    if (fn.guid) {
      for (let n = 0; n < handlers.length; n++) {
        if (handlers[n].guid === fn.guid) {
          handlers.splice(n--, 1)
        }
      }
    }
    tidyUp(elem, type)
  };
})();


// 清理处理程序
const tidyUp = (elem, type) => {
  const isEmpty = (object) => {
    for ( let prop in object) {
      return false;
    }
    return true;
  };

  const data = getData(elem);

  if (data.handlers[type].length === 0) {
    delete data.handlers[type];

    if (document.removeEventListener) {
      elem.removeEventListener(type, data.dispatcher, false);
    } else if (document.detachEvent) {
      elem.detachEvent('on'+type, data.dispatcher);
    }

    // 是否还有其他事件类型处理程序
    if (isEmpty(data.handlers)) {
      delete  data.handlers;
      delete data.dispatcher;
    }

    // 是否还需要data
    if (isEmpty(data)) {
      removeData(elem);
    }
  }
};

/**
 * 触发事件
 * @param elem
 * @param event
 */
const triggerEvent = (elem, event) => {
  const elemData = getData(elem);
  const parent = elem.parentNode || elem.ownerDocument;

  if (typeof event === 'string') {
    event = { type: event, target: elem};
  }

  // 规范化event
  event = fixEvent(event);

  // 如果传入的事件有事件调度器就执行该类型的处理程序
  if (elemData.dispatcher) {
    elemData.dispatcher.call(elem, event);
  }

  // 除非显式的停止冒泡，一直调用该函数将事件向上冒泡
  if (parent && !event.isPropagationStopped()) {
    triggerEvent(parent, event)
  }
  // 如果dom到顶了就触发默认行为（除非禁用）
  else if (!parent && !event.isDefaultPrevented()) {

    const targetData = getData(event.target);
    // 判断模板元素有没有默认该事件的默认行为
    if (event.target[event.type]) {
      // 零时禁用事件调度器
      targetData.disabled = true;
      // 执行默认行为
      event.target[event.type]();
      targetData.disabled = false;
    }
  }
};

/**
 * 事件冒泡检测
 * @param eventName
 */
const isEventSupported = (eventName) => {
  let element = document.createElement('div');
  let isSupported;
  eventName = 'on' + eventName;
  // 检测元素是否有一个属性表示该事件，来判断是否支持该事件
  isSupported = (eventName in element);
  //检查失败，创建一个同名特性并检查其是否可以支持该事件
  if (!isSupported) {
    element.setAttribute(eventName, 'return');
    isSupported = typeof element[eventName] === 'function';
  }
  element = null;
  return isSupported;
};

/**
 * 冒泡submit事件
 */
(() =>{
  const isSubmitSupported = isEventSupported('submit');

  // 判断一个元素是否在表当中
  const isInForm = (elem) => {
    let parent = elem.parentNode;
    while (parent) {
      if (parent.nodeName.toLowerCase() === 'form') {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  };

  // 判断submit是否借助click事件触发
  const triggerSubmitOnClick = (e) => {
    const type = e.target.type;
    if ((type === 'submit' || type === 'image') && isInForm(e.target)) {
      return triggerEvent(this,'submit');
    }
  };

  // 判断submit事件是否借助keypresses事件触发
  const triggerSubmitOnKey = e => {
    const type = e.target.type;
    if ((type === 'text' || type === 'password') && isInForm(e.target) && e.keyCode === 13) {
      return triggerEvent(this, 'submit')
    }
  };

  // 绑定submit事件
  const addSubmit = (elem, fn) => {

    // 正常绑定
    addEvent(elem, 'submit', fn);
    if (isSubmitSupported) return;

    // 如果不是form元素，并且该submit处理程序是第一个处理程序，创建click和keypress借道处理程序
    if (elem.nodeName.toLowerCase() !== 'form'  && getData(elem).handlers.submit.length === 1) {
      addEvent(elem, 'click', triggerSubmitOnClick);
      addEvent(elem, 'keypress', triggerSubmitOnKey);
    }
  };

  // 解绑submit事件
  const removeSubmit = (elem, fn) => {
    // 正常解绑
    removeEvent(elem, 'submit', fn);
    if (isEventSupported('submit')) return;
    const data = getData(elem);

    // 如果不是form元素，且该submit是要解绑的组后一个处理程序
    if (elem.nodeName.toLowerCase() !== 'form'&& !data || !data.events || !data.events.submit) {
      removeEvent(elem, 'click', triggerSubmitOnClick);
      removeEvent(elem, 'click', triggerSubmitOnKey);
    }
  };
})();

/**
 * 冒泡change事件
 */
(() => {
  const isChangeSupported = isEventSupported('change');

  // click事件借道处理
  const triggerChangeOnClick = e => {
    const type = e.target.type;
    if (type === 'radio' || type === 'checkbox' || e.target.nodeName.toLowerCase() === 'select') {
      return triggerChangeIfValueChanged.call(this, e);
    }
  };

  // keydown事件借道处理
  const triggerChangeOnKeyDown = e => {
    const type = e.target.type;
    const key = e.keyCode;

    if (key === 13 && e.target.nodeName.toLowerCase() !== 'textarea' ||
        key === 32 && (type === 'checkbox' || type === 'radio' ||
        type === 'select-multiple')) {
      return triggerChangeIfValueChanged.call(this, e)
    }
  };

  // 为将要到来的focusout事件保存元素的值
  const triggerChangeOnBefore = e => {
    getData(e.target)._change_data = getVal(e.target);
  };

  // 获取传入元素的值
  const getVal = elem => {
    const type = elem.type;
    let val = elem.value;

    if (type === 'radio' || type === 'checkbox') {
      val = elem.checked
    } else if (type === 'select-multiple') {
      val = '';
      if (elem.selectedIndex > -1) {
        for (let i = 0; i <elem.options.length; i++) {
          val += '-'+elem.options[i].selected;
        }
      }
    } else if (elem.nodeName.toLowerCase() === 'select') {
      val = elem.selectedIndex
    }
    return val;
  };

  // focusout借道处理，如果元素的值改变就触发change事件
  const triggerChangeIfValueChanged = e => {
    const elem = e.target;
    let data,val;
    const formElems = /textarea|input|select/i;

    if ( !formElems.test(elem.nodeName) || elem.readonly) return;

    data = getData(elem)._change_data;
    val = getVal(elem);

    if (e.type !== 'focusout' || elem.type !== 'radio') {
      getData(elem)._change_data = val;
    }

    if (data === undefined || val === data) return;

    if (data != null || val) return triggerEvent(elem, 'change')

  };

  this.addChange = (elem, fn) => {
    addEvent(elem, 'change', fn);
    if (isChangeSupported) return;
    if (getData(elem).events.change.length === 1) {
      addEvent(elem, 'focusout',triggerChangeIfValueChanged);
      addEvent(elem, 'click', triggerChangeOnClick);
      addEvent(elem, 'keydown', triggerChangeOnKeyDown);
      addEvent(elem,'beforeactivate', triggerChangeOnBefore);
    }
  };

  this.removeChange = (elem, fn) => {
    removeEvent(elem, 'change', fn);
    if (isChangeSupported) return;
    const data = getData(elem);

    if (!data || !data.events || !data.events.submit) {
      removeEvent(elem, 'focusout',triggerChangeIfValueChanged);
      removeEvent(elem, 'click', triggerChangeOnClick);
      removeEvent(elem, 'keydown', triggerChangeOnKeyDown);
      removeEvent(elem,'beforeactivate', triggerChangeOnBefore);
    }
  }

})();