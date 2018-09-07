function setRem() {
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let htmlDom = document.getElementsByTagName("html")[0];
    htmlDom.style.fontSize = htmlWidth / 10 + "px";
}
setRem();
window.onresize = setRem;