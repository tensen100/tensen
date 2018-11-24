const supportedOpacity = () => {
  const div = document.createElement('div');
  div.setAttribute('style','opacity:.5');
  return div.style.opacity === '0.5';
};

const getOpacity = (element) => {
  if (supportedOpacity()) {
    return parseFloat(element.style.opacity)
  } else {
    return parseInt(element.style.filter.match(/opacity=(\d{1,2})/)[1]) / 100
  }
};