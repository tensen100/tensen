// 连字符转驼峰

const translate = value => value.replace(/-([a-z])/ig, function (all, letter) {
  return letter.toUpperCase()
});