//index.js
//获取应用实例
const app = getApp()
var base64 = require('../../utils/base64.js');

Page({
    data: {
        interval: 5000,
        duration: 500,
        imgSrc: [],
        dataList: [],
        cardList: []
        // dataList: [
        //     [{
        //             id: 0,
        //             imgUrl: '../../images/1.jpg',
        //             text: "冰沁心甜夏天见"
        //         },
        //         {
        //             id: 1,
        //             imgUrl: '../../images/2.jpg',
        //             text: "妈妈，我想对你说"
        //         }
        //     ],
        //     [{
        //             id: 2,
        //             imgUrl: '../../images/3.jpg',
        //             text: "哈哈哈"
        //         },
        //         {
        //             id: 3,
        //             imgUrl: '../../images/4.jpg',
        //             text: "呵呵呵呵"
        //         }
        //     ],
        //     [{
        //             id: 4,
        //             imgUrl: '../../images/5.jpg',
        //             text: "4444444"
        //         },
        //         {
        //             id: 5,
        //             imgUrl: '../../images/1.jpg',
        //             text: "5555555"
        //         }
        //     ],
        //     [{
        //             id: 6,
        //             imgUrl: '../../images/5.jpg',
        //             text: "6666"
        //         },
        //         {
        //             id: 7,
        //             imgUrl: '../../images/1.jpg',
        //             text: "77777"
        //         }
        //     ],
        // ],
    },

    onLoad: function() {
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
                    var item = JSON.parse(base64.decode(itemObj.value));
                    // console.log(base64.decode(itemObj.value))
                    for (var j = 0, lenj = item.cards.length; j < lenj; j++) {
                        self.data.imgSrc[j] = item.cards[j].spec.logo;
                    }
                }
                self.setData({
                    imgSrc: self.data.imgSrc
                })
                // console.log(self.data.imgSrc)
            }
        })
        // 卡片
        wx.request({
            url: 'https://www.lytall.com/v1/cards',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                var resObj = JSON.parse(res.data.data);
                var rowList = [];
                for (var i = 0, len = resObj.kvs.length, j = 0; i < len; i++) {
                    var itemBase64 = resObj.kvs[i];
                    var item = JSON.parse(base64.decode(itemBase64.value));
                    // console.log(base64.decode(itemBase64.value))
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
            console.log(res.target)
        }
        return {
            title: '礼道',
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
        // console.log(e)
        var selectedIndex = e.currentTarget.dataset.id;
        var selectedImgUrl;
        for (var i = 0, len = this.data.cardList.length; i < len; i++) {
            if (i == selectedIndex) {
                this.data.cardList[i].isChecked = true;
                selectedImgUrl = this.data.cardList[i].spec.logo;
            } else {
                this.data.cardList[i].isChecked = false;
            }
        }
        wx.navigateTo({
            url: '../gift/gift?text=' + e.currentTarget.dataset.text +
                '&cardList=' + JSON.stringify(this.data.cardList) + '&selectedImgUrl=' + selectedImgUrl
        })
    },
})