/**
 * Created by Administrator on 2017/9/25.
 */

/**
 * 播放器构造函数
 * @constructor
 */
function VideoPlayer() {
  this.init();
}
// 初始化
VideoPlayer.prototype.init = function () {
  this.video = document.querySelector('#videoPlayer'); // 播放器
  this.shadow = document.querySelector('.video-overlay-shadow');
  this.loading = document.querySelector('.video-overlay-loading');

  this.overlayPlay = document.querySelector('.video-overlay-play');
  this.palyBtn = document.querySelector('#play');

  this.control = document.querySelector('.video-control'); // 控制器
  this.controlPlay = this.control.querySelector('#controlPlay');

  this.controlTotalBar = this.control.querySelector('.total'); // 进度条
  this.controlCurrentBar = this.control.querySelector('.current');
  this.controlHandle = this.control.querySelector('.handle');

  this.barLength = this.controlTotalBar.offsetWidth; // 进度条长度
  this.timeTotal = document.createTextNode('00:00'); // 视频总时间
  this.control.querySelector('.time_total').appendChild(this.timeTotal);

  this.timeCurrent = document.createTextNode('00:00'); //当前播放时间
  this.control.querySelector('.time_current').appendChild(this.timeCurrent);

  this.bind();

};
VideoPlayer.prototype.bind = function () {
  this.video.ontimeupdate = () => {
    this.updateTime()
  };
  this.video.oncanplay = () => {
    this.timeTotal.nodeValue =  getTime(this.video.duration)
  };
  this.video.onwaiting = () => {
    this.showLoading()
  };
  this.video.onplaying = () => {
    this.hiddenLoading();
  };

  this.palyBtn.onclick = () => {
    this.play();
    this.hiddenOverlayPlay();
  };
  this.shadow.onclick = () => {
    this.showControl();

    /*setTimeout(()=>{
      this.hiddenControl()
    },3000)*/
  };
  this.controlPlay.onclick = () => {
    if(this.video.paused) {
      this.play()
    }else{
      this.pause();
    }
  };

  let startX;
  let currentWeight;
  let currentTime;
  let startEvent = (e) => {
    this.pause();
    startX = e.touches[0].pageX;
    currentWeight = this.controlCurrentBar.offsetWidth;
  };
  let moveEvent = (e) => {
    this.controlCurrentBar.style.width = currentWeight +(e.touches[0].pageX - startX) + 'px';
    currentTime = this.controlCurrentBar.offsetWidth / this.barLength * this.video.duration;
    this.timeCurrent.nodeValue = getTime(currentTime)
  };
  let endEvent = (e) => {
    this.video.currentTime = currentTime;
    this.play();
  };

  this.controlHandle.addEventListener('touchstart',startEvent);
  this.controlHandle.addEventListener('touchmove',moveEvent);
  this.controlHandle.addEventListener('touchend',endEvent);

};
/**
 * 播放
 */
VideoPlayer.prototype.play = function () {
  this.video.play();
  addClass(this.controlPlay,'play')
};
/**
 * 暂停
 */
VideoPlayer.prototype.pause = function () {
  this.video.pause();
  clearInterval(this.timeInterval);
  this.timeInterval = null;
  removeClass(this.controlPlay,'play')
};
/**
 * 更新时间和进度条
 */
VideoPlayer.prototype.updateTime = function () {
  let v = this.video;
  let ct = v.currentTime;
  let tt = v.duration;
  this.timeCurrent.nodeValue = getTime(ct);
  this.controlCurrentBar.style.width = (ct / tt * this.barLength) + 'px';
};
VideoPlayer.prototype.hiddenOverlayPlay = function () {
  removeClass(this.overlayPlay,'show')
};
VideoPlayer.prototype.showOverlayPlay = function () {
  addClass(this.overlayPlay,'show')

};
VideoPlayer.prototype.showControl = function () {
  addClass(this.control,'show')
};
VideoPlayer.prototype.hiddenControl = function () {
  removeClass(this.control,'show')
};
VideoPlayer.prototype.showLoading = function () {
  addClass(this.loading,'show');
};
VideoPlayer.prototype.hiddenLoading = function () {
 removeClass(this.loading,'show')
};

function addClass(ele,className) {
  let arr = ele.className.split(' ');
  for(let i= 0,val;val = arr[i++];){
    if( val === className) {
      return;
    }
  }
  arr.push(className);
  ele.className = arr.join(' ')
}
function removeClass(ele,className) {
  let arr = ele.className.split(' ');
  let length = arr.length;
  for( let i = 0;i<length;i++ ){
    if( arr[i] === className){
      arr.splice(i,1);
      ele.className = arr.join(' ');
      return;
    }
  }
}
/**
 * 将秒转换为时间
 * @param time
 * @returns {string}
 */
function getTime(time){
  time = Math.floor(time);
  let str = '';
  let h = Math.floor(time / 3600);
  let m = Math.floor(time % 3600 / 60 );
  let s = Math.floor(time % 60);
  if(h){
    str += Math.floor(h / 10) + '' + Math.floor( h % 10) + ':'
  }
  str += Math.floor(m /10) + ''+ Math.floor( m % 10) + ':';
  str += Math.floor(s / 10) + '' + Math.floor( s % 10);
  return str
}
