//index.js
//获取应用实例
const app = getApp()
var base64 = require('../../utils/base64.js');

Page({
  data: {
    background: ['', '', ''],
    interval: 5000,
    duration: 500,
    imgSrc: [],
    dataList:[]
    // dataList: [
    //   [
    //     {
    //       id: 0,
    //       imgUrl: '../../images/1.jpg',
    //       text: "冰沁心甜夏天见"
    //     },
    //     {
    //       id: 1,
    //       imgUrl: '../../images/2.jpg',
    //       text: "妈妈，我想对你说"
    //     }
    //   ],
    //   [
    //     {
    //       id: 2,
    //       imgUrl: '../../images/3.jpg',
    //       text: "哈哈哈"
    //     },
    //     {
    //       id: 3,
    //       imgUrl: '../../images/4.jpg',
    //       text: "呵呵呵呵"
    //     }
    //   ],
    //   [
    //     {
    //       id: 4,
    //       imgUrl: '../../images/5.jpg',
    //       text: "4444444"
    //     },
    //     {
    //       id: 5,
    //       imgUrl: '../../images/1.jpg',
    //       text: "5555555"
    //     }
    //   ],
    //   [
    //     {
    //       id: 6,
    //       imgUrl: '../../images/5.jpg',
    //       text: "6666"
    //     },
    //     {
    //       id: 7,
    //       imgUrl: '../../images/1.jpg',
    //       text: "77777"
    //     }
    //   ],
    // ],
  },

  onLoad: function() {
    var self = this;
    wx.request({
      url: 'https://www.lytall.com/v1/goods', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        var resObj = JSON.parse(res.data.data);
        var dataList = [];
        for (var i = 0, len = resObj.kvs.length; i < len; i++) {
          var itemObj = resObj.kvs[i];
          console.log(base64.decode(itemObj.value))
          dataList[i] = JSON.parse(base64.decode(itemObj.value));
        }
        self.setData({
          dataList: self.data.dataList
        })
      }
    })
  },

  changeProperty: function(e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '星巴克用星说',
      path: 'pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  navigate: function(e) {
    wx.navigateTo({
      url: '../gift/gift?id=' + e.currentTarget.dataset.id + '&text=' + e.currentTarget.dataset.text
    })
  },
})