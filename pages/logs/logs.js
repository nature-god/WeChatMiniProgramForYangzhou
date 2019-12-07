//logs.js
const util = require('../../utils/util.js')

Page({
  data: {//参与页面渲染的数据
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
