

/**
 * 预处理XML/HTML源字符串，将<table/>这样的标签自转换为<table></table>
 * @param html
 * @returns {*}
 */
const tags = /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i;
const covert = html => {
  return html.replace(/(<(\w+)[^>]*?)\/>/g, (all, front, tag) => {
    return tags.test(tag) ? all : front + '></' + tag + '>';
  })
};

console.log('预处理：<a/>',covert('<a/>'));

/**
 * html包装
 * 某些元素被注入之前，必须存放再特定的容器元素中
 */


/**
 * 将一些标签生成一个dom节点列表
 * @param htmlString
 * @param doc
 * @param fragmend
 * @returns {NodeListOf<Node & ChildNode>}
 */
const getNodes = (htmlString, doc, fragmend) => {

  // 元素类型和父容器之间的映射
  const map = {
    '<td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    '<th': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    '<tr': [2, '<table><thead>', '</thead></table>'],
    '<option': [1, '<select multiple="multiple">', '</select>'],
    '<optgroup': [1, '<select multiple="multiple">', '</select>'],
    '<legend': [1, '<fieldset>', '</fieldset>'],
    '<thead': [1, '<table>', '</table>'],
    '<tbody': [1, '<table>', '</table>'],
    '<tfoot': [1, '<table>', '</table>'],
    '<colgroup': [1,'<table>', '</table>'],
    '<caption': [1,'<table>', '</table>'],
    '<col': [2,'<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    '<link': [3, '<div></div><div>', '</div>']
  };

  // 匹配标签名称
  const tagName = htmlString.match(/<\w+/);

  // 如果匹配了映射内容就获取该条目。否则构建深度为0的空父标签
  let mapEntry = tagName ? map[tagName[0]] : null;
  if (!mapEntry) mapEntry = [0, '', ''];

  // 创建一个div元素，在里面创建新节点
  let div = (doc || document).createElement('div');
  div.innerHTML = mapEntry[1] + htmlString + mapEntry[2];

  // 返回新创建的元素
  while (mapEntry[0] --) div = div.lastChild;

  // 将新节点添加到frament中
  if (fragmend) {
    while (div.firstChild) {
      fragmend.appendChild(div.firstChild);
    }
  }
  return div.childNodes;
};

console.log('getNodes',getNodes('<td></td>'));

/**
 * 找出元素的插入点,防止将表格行插入到<tbody>中
 * @param elem
 * @param cur
 */
const root = (elem, cur) => {
  return elem.nodeName.toLowerCase() === 'table' &&
    cur.nodeName.toLowerCase() === 'tr' ?
    (elem.getElementsByTagName('tbody')[0]) ||
    elem.appendChild(elem.ownerDocument.createElement('tbody')) :
    elem
};

/**
 * 再dom的多个位置上插入DOM片段
 * @param elems
 * @param args
 * @param callback
 */
const insert = (elems, args, callback) => {
  if (elems.length) {
    const doc = elems[0].ownerDocument || elems[0];
    const fragment = doc.createDocumentFragment();
    const scripts = getNodes(args, doc, fragment);
    const first = fragment.firstChild;

    if (first) {
      for (let i = 0; elems[i]; i++) {
        callback.call(root(elems[i], first), fragment.cloneNode(true));
      }
    }
  }
};

/**
 * XPath表达式查询DOM
 * @param expression
 * @param parentElement
 * @returns {Array}
 */
const getElementByXPath = (expression, parentElement) => {
  const result = [];
  const query = document.evaluate(expression, parentElement || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  for (let i = 0,length = query.snapshotLength; i < length; i++) {
    result.push(query.snapshotItem[i])
  }
  return result;
};