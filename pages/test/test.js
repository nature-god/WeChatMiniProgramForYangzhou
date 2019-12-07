var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;//是否在绘制中
var arrx = [];//动作横坐标
var arry = [];//动作纵坐标
var arrz = [];//总做状态，标识按下到抬起的一个组合
var newarr = new Array;//结果数组
var text = '';
for(var i = 0;i < 16;i++)
{
  newarr[i] = new Array;
  for(var j = 0;j < 16;j++)
  {
    newarr[i][j] = 0;
  }
}
var canvasw = 0;//画布宽度
var canvash = 0;//画布高度
var scale = 0;//16格中每格宽度
// pages/shouxieban/shouxieban.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    //canvas宽高
    canvasw: 0,
    canvash: 0,
    scale: 0,
    //canvas生成的图片路径
    canvasimgsrc: "",
    arraytext:''
  },
  //画布初始化执行
  startCanvas: function () {
    var that = this;
    //创建canvas
    this.initCanvas();
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        canvasw = res.windowWidth - 0;//设备宽度
        canvash = canvasw;
        scale = canvash/16;
        that.setData({ 'canvasw': canvasw });
        that.setData({ 'canvash': canvash });
        that.setData({ 'scale': scale });
       // console.log("canvashight",canvash);
      }
    });

  },
  //初始化函数
  initCanvas: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(scale);
    context.setLineCap('round');
    context.setLineJoin('round');
  },
  //事件监听
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  canvasStart: function (event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);

  },
  canvasMove: function (event) {
    if (isButtonDown) {
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);

    };
    //console.log(arrx);
    //console.log(arry);
    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      };

    };
    context.clearRect(0, 0, canvasw, canvash);

    context.setStrokeStyle('#000000');
    context.setLineWidth(scale);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();

    context.draw(false);
  },
  canvasEnd: function (event) {
    isButtonDown = false;
  },
  //清除画布
  cleardraw: function () {
    var that = this;
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(true);
    that.setData({ arraytext: '' });
    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 16; j++) {
        newarr[i][j] = 0;
        
      }
    }
  },
  //提交绘画内容
  forward: function () {
    wx.request({
      url: 'https://www.tongjinhz.com/test7/webapi/myresource',
      data: {
        res: 'forward',
      },
      method: 'post',
      //header: {
      //  'Content-Type': 'json' // 使用这个能正常获取数据
      //},
      success: function (res) {
        console.log(res.data.arr);
      }
    })
  },
  backend:function (){
    wx.request({
      url: 'https://www.tongjinhz.com/test7/webapi/myresource',
      data: {
        res: 'backend',
      },
      method: 'post',
      //header: {
      //  'Content-Type': 'json' // 使用这个能正常获取数据
      //},
      success: function (res) {
        console.log(res.data.arr);
      }
    })
  },
  
  setSign: function () {
    var that = this;
    if (arrx.length == 0) {
      wx.showModal({
        title: '提示',
        content: '绘画内容不能为空！',
        showCancel: false
      });
      return false;
    };

    for(var i=0;i<arrx.length;i++)
    {
      var new_x = Math.round(arry[i] / scale);
      var new_y = Math.round(arrx[i] / scale);//将坐标四舍五入转化成格子坐标
      if( !newarr[new_x][new_y])
        newarr[new_x][new_y] = 1;//设置格子的值
    }
    text = '';
    for(var i=0;i<16;i++)//打印最后矩阵墙的效果图（后续可换成黑白的图片取代数字）
    {
      for(var j=0;j<16;j++)
        {        
          text += newarr[i][j];
          text += ' ';
         // that.setData({ arraytext: text });
        }
        text += "\n";
     
    }
    that.setData({ arraytext: text });
  },
  getStart:function() {
    wx.request({
      url: 'https://www.tongjinhz.com/test7/webapi/myresource',
      data: {
        res: text,
      },
      method: 'post',
      //header: {
      //  'Content-Type': 'json' // 使用这个能正常获取数据
      //},
      success: function (res) {
        console.log(text);        
        console.log(res.data.arr);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //画布初始化执行
    this.startCanvas();

  }
})