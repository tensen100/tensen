const translation = {
  for: 'htmlFor',
  class: 'className',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  cellspacing: 'cellSpacing',
  rowspan: 'rowSpan',
  colspan: 'colSpan',
  tabindex: 'tabIndex',
  cellpadding: 'cellPading',
  usemap: 'useMap',
  frameborder: 'frameBorder',
  contenteditable: 'contentEditable'
};

/**
 * 获取|设置属性
 * @param element
 * @param name
 * @param value
 * @returns {string}
 */
const attr = (element, name, value) => {
  const property = translation[name] || name;
  const propertyExists = typeof element[property] !== 'undefined';

  if ( typeof  value !== 'undefined' ) {
    if ( propertyExists ) {
      element[property] = value;
    } else {
      element.setAttribute(name, value)
    }
  }

  return propertyExists ? element[property] : element.getAttribute(name);
};

window.attr = attr;