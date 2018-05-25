// pages/card/card.js
const util = require('../../utils/util.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        srcPage: '',
        selectedImgUrl: '../../images/1.jpg',
        productCount: 0,
        totalPrice: 0,
        canBuy: false,

        recommendList: [
            {
                id: 1,
                imgUrl: '../../images/1.jpg',
                isChecked: false
            },
            {
                id: 2,
                imgUrl: '../../images/2.jpg',
                isChecked: false
            },
            {
                id: 3,
                imgUrl: '../../images/3.jpg',
                isChecked: false
            },
            {
                id: 4,
                imgUrl: '../../images/4.jpg',
                isChecked: false
            },
            {
                id: 5,
                imgUrl: '../../images/5.jpg',
                isChecked: false
            },
        ],

        productList:
        [
            {
                id: 1,
                imgUrl: '../../images/1.jpg',
                name: '当即特饮',
                price: 40,
                count: 1,
                hidden: false
            },
            {
                id: 2,
                imgUrl: '../../images/2.jpg',
                name: '焦糖玛奇朵',
                price: 39,
                count: 1,
                hidden: false
            },
            {
                id: 3,
                imgUrl: '../../images/3.jpg',
                name: '美式咖啡',
                price: 35,
                count: 1,
                hidden: false
            },
            {
                id: 4,
                imgUrl: '../../images/1.jpg',
                name: '摩卡',
                price: 27,
                count: 1,
                hidden: false
            },
            {
                id: 5,
                imgUrl: '../../images/2.jpg',
                name: '冷萃冰咖啡',
                price: 36,
                count: 1,
                hidden: false
            },
            {
                id: 6,
                imgUrl: '../../images/3.jpg',
                name: '拿铁',
                price: 31,
                count: 1,
                hidden: false
            },
        ]
    },

    onImageClick: function (e) {
        var target = e.target
        var imgUrl = target.dataset.selectedimg

        for (var i = 0; i < this.data.recommendList.length; i++) {
            if (i == target.id - 1) {
                this.data.recommendList[i].isChecked = true;
            } else {
                this.data.recommendList[i].isChecked = false;
            }
        }

        this.setData({
            selectedImgUrl: imgUrl,
            recommendList: this.data.recommendList
        })
    },

    showCount: function (e) {
        // console.log(e)
        var index = e.target.id;
        var item = this.data.productList[index - 1];

        item.hidden = !item.hidden;
        ++this.data.productCount;
        this.data.totalPrice += item.price;

        this.setData({
            productList: this.data.productList,
            productCount: this.data.productCount,
            totalPrice: this.data.totalPrice,
            canBuy: true
        })
    },

    addCount: function (e) {
        // console.log(e)
        var index = e.target.id;
        var item = this.data.productList[index - 1];

        ++item.count;
        ++this.data.productCount;
        this.data.totalPrice += item.price;

        this.setData({
            productList: this.data.productList,
            productCount: this.data.productCount,
            totalPrice: this.data.totalPrice
        })
    },

    minusCount: function (e) {
        var index = e.target.id;
        var item = this.data.productList[index - 1]

        --item.count;
        --this.data.productCount;
        this.data.totalPrice -= item.price;

        if (item.count == 0) {
            item.count = 1
            item.hidden = !item.hidden
        }
        if (this.data.productCount == 0) {
            this.data.canBuy = false;
        }

        this.setData({
            productList: this.data.productList,
            productCount: this.data.productCount,
            totalPrice: this.data.totalPrice,
            canBuy: this.data.canBuy
        })
    },

    onFocusChange: function (e) {
        var item = this.data.productList[e.target.id - 1];

        this.data.productCount -= item.count;
        this.data.totalPrice -= item.count * item.price;

        if (e.detail.value == null || e.detail.value == '') {
            e.detail.value = 0;
        }

        item.count = parseInt(e.detail.value);

        this.data.productCount += item.count;
        this.data.totalPrice += item.count * item.price;

        if (this.data.productCount <= 0) {
            item.count = 1;
            item.hidden = false;
            this.data.productCount = 0;
            this.data.totalPrice = 0;
            this.data.canBuy = false;
        }

        this.setData({
            productCount: this.data.productCount,
            totalPrice: this.data.totalPrice,
            productList: this.data.productList,
            canBuy: this.data.canBuy
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            srcPage: util.getCurrentPageUrlWithArgs()
        })
        var text = util.getTextFromSrcPage(this.data.srcPage)
        if (text === 'undefined') {
          text = '星巴克用星说'
        }
        wx.setNavigationBarTitle({
            title: text
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})