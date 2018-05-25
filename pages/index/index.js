//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    background: ['', '', ''],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 5000,
    duration: 500,
    imgSrc: ['../../images/4.jpg', '../../images/5.jpg'],
    blockImg1: '../../images/4.jpg',
    blockImg2: '../../images/5.jpg',
    blockImg3: '../../images/4.jpg',
    blockImg4: '../../images/5.jpg',
    blockImg5: '../../images/4.jpg',
    blockImg6: '../../images/5.jpg',
    blockImg7: '../../images/4.jpg',
    blockImg8: '../../images/5.jpg'
  },
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  onLoad: function () {
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '星巴克用星说',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  navigate: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '../card/card?id=' + e.currentTarget.dataset.id + '&text=' + e.currentTarget.dataset.text
    })
  }
})
