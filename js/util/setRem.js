function setRem() {
    let htmlWidth = document.documentElement.clientWidth || document.body.ClientWidth;
    let htmlDom = document.getElementsByTagName("html")[0];
    htmlDom.style.fontSize = htmlWidth / 10 + "px";
}
setRem();
window.onresize = setRem;