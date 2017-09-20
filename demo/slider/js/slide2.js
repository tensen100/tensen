var getElement = function (id) {
    if(id.substr(0,1) == "."){
        return document.getElementsByClassName(id);
    }
    return document.getElementById(id);
}
