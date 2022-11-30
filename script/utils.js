function randomNum (start, end) {
  return Math.floor(Math.random() * (end - start)) + start
}

function randomColor () {
  return 'rgba(' + randomNum(0, 255) + ',' + randomNum(0 ,255) + ',' + randomNum(0, 255) + ')'
}