function addClass(el, className) {
    const classList = el.className.split(' ');
    if (classList.includes(className)) {
        return ;
    }
    classList.push(className);
    el.className = classList.join(' ')

}
function removeClass(el,className) {
    const classList = el.className.split(' ');
    const idx = classList.indexOf(className);
    if (idx > -1) {
        classList.splice(idx,1)
    }
    el.className = classList.join(' ')
}
function toggleClass(el, className) {
    const classList = el.className.split(' ');
    const idx = classList.indexOf(className);
    if (idx > -1) {
        classList.splice(idx,1)
    }else {
        classList.push(className)
    }
    el.className = classList.join(' ')
}