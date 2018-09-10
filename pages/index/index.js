//index.js
//获取应用实例
const app = getApp();
// var base64 = require('../../utils/base64.js');
var bas64Util = require('../../utils/base64.min.js').Base64

Page({
    data: {
        interval: 5000,
        duration: 500,
        imgSrc: [],
        dataList: [],
        cardList: [],
    },

    onLoad: function(options) {
        var self = this;
        // 轮播图
        wx.request({
            url: 'https://www.lytall.com/v1/carousels',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                var resObj = JSON.parse(res.data.data);
                for (var i = 0, len = resObj.kvs.length; i < len; i++) {
                    var itemObj = resObj.kvs[i];
					var item = JSON.parse(bas64Util.decode(itemObj.value));
                    // console.log(bas64Util.decode(itemObj.value))
                    for (var j = 0, lenj = item.cards.length; j < lenj; j++) {
                        self.data.imgSrc[j] = item.cards[j].spec;
                    }
                }
                self.setData({
                    imgSrc: self.data.imgSrc
                })
                console.log("请求成功")
            },
            fail: function(res) {
                console.log("请求失败：" + JSON.stringify(res))
            }
        })
        // 卡片
        wx.request({
            url: 'https://www.lytall.com/v1/cards',
            method: 'GET',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                var resObj = JSON.parse(res.data.data);
                var rowList = [];
                for (var i = 0, len = resObj.kvs.length - 2, j = 0; i < len; i++) {
                    var itemBase64 = resObj.kvs[i];
					var item = JSON.parse(bas64Util.decode(itemBase64.value));
                    // console.log(bas64Util.decode(itemBase64.value))
                    item.index = i;

                    self.data.cardList[i] = item;

                    if (i % 2 == 0) {
                        rowList = [];
                    }
                    rowList[i % 2] = item;
                    self.data.dataList[Math.floor(i / 2)] = rowList;
                }
                self.setData({
                    dataList: self.data.dataList,
                    cardList: self.data.cardList
                })
                // console.log(self.data.cardList)
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
            // console.log(res.target)
        }
        return {
			title: '微信送礼，一秒送达，快来体验吧！',
            path: 'pages/index/index',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },

    cardNavigate: function(e) {
        // console.log(e)
        var selectedIndex = e.currentTarget.dataset.id;
        var selectedCard = {};
        for (var i = 0, len = this.data.cardList.length; i < len; i++) {
            if (i == selectedIndex) {
                this.data.cardList[i].isChecked = true;
                selectedCard = this.data.cardList[i];
            } else {
                this.data.cardList[i].isChecked = false;
            }
        }

        wx.navigateTo({
            url: '../gift/gift?text=' + e.currentTarget.dataset.text +
                '&cardList=' + JSON.stringify(this.data.cardList) + '&selectedCard=' + JSON.stringify(selectedCard)
        })
    },

    bannerNavigate: function(e) {
        var carousel = e.currentTarget.dataset.item;

        wx.navigateTo({
            url: '../bannerimg/bannerimg?forwardURL=' + carousel.forwardURL
        })
    }
})