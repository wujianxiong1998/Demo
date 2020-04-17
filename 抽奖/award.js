let blocks = document.getElementsByClassName("block");
// 数组存放的是盒子的下标，按照顺时针的顺序
let arr = [0, 1, 2, 5, 8, 7, 6, 3],
  i = 0,
  count = 0,
  stopTimer;
let rand = Math.floor(Math.random() * 8 + 50); // 给出一个停止计时器的随机数 count的值等于这个随机数时停止计时器
let around = function () {
  // 将其他盒子都变为白色
  for (let j = 0; j < arr.length; j++) {
    blocks[arr[j]].style.background = "white";
  }
  // 这里blocks的取值为 blocks[0] blocks[1] blocks[2] blocks[5] blocks[8] blocks[7] blocks[6] blocks[3]
  // 将当前arr[i]值所对应的盒子修改为粉色
  blocks[arr[i]].style.background = "pink";
  i++;
  // 重制i的值
  if (i === arr.length) {
    i = 0;
  }
  count++; // count是一个计数器 根据count的值来调整速度
  // 下面的4个if根据count的值来关闭计时器和重启计时器 改变计时器的时间间隔
  if (count === 5 || count === 45) {
    clearInterval(stopTimer);
    stopTimer = setInterval(around, 200);
  }
  if (count === 10 || count === 35) {
    clearInterval(stopTimer);
    stopTimer = setInterval(around, 100);
  }
  if (count === 15) {
    clearInterval(stopTimer);
    stopTimer = setInterval(around, 50);
  }
  // 当等于上面的随机数时，停止计时器
  if (count === rand) {
    clearInterval(stopTimer);
  }
}
// 给开始按钮绑定点击事件 点击后执行 around 
let start = function () {
  blocks[4].removeEventListener("click", start); // 当用户点击了开始按钮后 必须要移除该事件 防止用户重复点击
  stopTimer = setInterval(around, 300);
}
blocks[4].addEventListener("click", start);