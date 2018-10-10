/**
 * 获取计算样式
 * @param element
 * @param property
 * @returns {string}
 */
const fetchComputedStyle = (element, property) => {
  if (window.getComputedStyle) {
    const computedStyles = window.getComputedStyle(element);

    if (computedStyles) {
      property = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return computedStyles.getPropertyValue(property);
    }
  } else if (element.currentStyle) {
    property = property.replace(/-([a-z])/ig, (all, letter) => letter.toUpperCase());
    return element.currentStyle[property]
  }
};