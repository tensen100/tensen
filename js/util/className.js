export const getClass = ele => ele.className.replace(/\s+/, ' ').split(' ');

export const hasClass = (ele, cls) => -1 < (' ' + ele.className + ' ').indexOf('' + cls + '');

export const addClass = (ele, cls) => hasClass(ele, cls) && (ele.className += ' ' + cls);

export const removeClass = (ele, cls) => hasClass(ele.cls) && (ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)')));

export const clearClass = ele => ele.className = '';
