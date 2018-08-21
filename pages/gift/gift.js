// pages/card/card.js
const util = require('../../utils/util.js')
var base64 = require('../../utils/base64.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // srcPage: '',
        title: '',
        selectedImgUrl: '',
        productCount: 0,
        totalPrice: 0,
        canBuy: false,

        showDialog: false,
        clickItem: {},
        cardList: [],
        // cardList: [{
        //         id: 1,
        //         imgUrl: '../../images/1.jpg',
        //         isChecked: true
        //     },
        //     {
        //         id: 2,
        //         imgUrl: '../../images/2.jpg',
        //         isChecked: false
        //     },
        //     {
        //         id: 3,
        //         imgUrl: '../../images/3.jpg',
        //         isChecked: false
        //     },
        //     {
        //         id: 4,
        //         imgUrl: '../../images/4.jpg',
        //         isChecked: false
        //     },
        //     {
        //         id: 5,
        //         imgUrl: '../../images/5.jpg',
        //         isChecked: false
        //     },
        // ],
        productList: []
        // productList: [{
        //         id: 1,
        //         imgUrl: '../../images/1.jpg',
        //         name: '当即特饮',
        //         price: 40,
        //         count: 1,
        //         hidden: false
        //     },
        //     {
        //         id: 2,
        //         imgUrl: '../../images/2.jpg',
        //         name: '焦糖玛奇朵',
        //         price: 39,
        //         count: 1,
        //         hidden: false
        //     },
        //     {
        //         id: 3,
        //         imgUrl: '../../images/3.jpg',
        //         name: '美式咖啡',
        //         price: 35,
        //         count: 1,
        //         hidden: false
        //     },
        //     {
        //         id: 4,
        //         imgUrl: '../../images/1.jpg',
        //         name: '摩卡',
        //         price: 27,
        //         count: 1,
        //         hidden: false
        //     },
        //     {
        //         id: 5,
        //         imgUrl: '../../images/2.jpg',
        //         name: '冷萃冰咖啡',
        //         price: 36,
        //         count: 1,
        //         hidden: false
        //     },
        //     {
        //         id: 6,
        //         imgUrl: '../../images/3.jpg',
        //         name: '拿铁',
        //         price: 31,
        //         count: 1,
        //         hidden: false
        //     },
        // ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options)
        this.setData({
            // srcPage: util.getCurrentPageUrlWithArgs(),
            cardList: JSON.parse(options.cardList),
            selectedImgUrl: options.selectedImgUrl
        })

        var text = options
        if (text === 'undefined') {
            text = '星巴克用星说'
        }
        wx.setNavigationBarTitle({
            title: options.text
        })
        this.setData({
            title: options.text
        })

        var self = this;
        wx.request({
            url: 'https://www.lytall.com/v1/goods',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                var resObj = JSON.parse(res.data.data);
                for (var i = 0, len = resObj.kvs.length; i < len; i++) {
                    var itemObj = resObj.kvs[i];
                    console.log(base64.decode(itemObj.value))
                    var item = self.data.productList[i] = JSON.parse(base64.decode(itemObj.value));
                    item.index = i;
                    item.spec.price = parseInt(item.spec.price);
                    item.spec.count = 1;
                }
                self.setData({
                    productList: self.data.productList
                })
            }
        })
    },

    onImageClick: function(e) {
        var target = e.target
        var imgUrl = target.dataset.selectedimg

        for (var i = 0; i < this.data.cardList.length; i++) {
            if (i == target.id) {
                this.data.cardList[i].isChecked = true;
            } else {
                this.data.cardList[i].isChecked = false;
            }
        }

        this.setData({
            selectedImgUrl: imgUrl,
            cardList: this.data.cardList
        })
    },

    onItemClick: function(e) {
        this.setData({
            clickItem: e.target.dataset.item
        })

        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })

        this.animation = animation
        animation.opacity(0).translateY(wx.getSystemInfoSync().windowHeight).step()
        this.setData({
            animationData: animation.export()
        })

        setTimeout(function() {
            animation.opacity(1).translateY(200).step();
            this.setData({
                animationData: animation
            })
        }.bind(this), 50)

        this.setData({
            showDialog: true
        })
    },

    onMaskClick: function(e) {
        this.setData({
            showDialog: false
        })
    },

    showCount: function(e) {
        // console.log(e)
        var index = e.target.id;
        var item = this.data.productList[index];
        // console.log(index)
        item.spec.hidden = !item.spec.hidden;
        ++this.data.productCount;
        this.data.totalPrice += item.spec.price;

        this.setData({
            productList: this.data.productList,
            productCount: this.data.productCount,
            totalPrice: this.data.totalPrice,
            canBuy: true
        })
    },

    addCount: function(e) {
        // console.log(e)
        var index = e.target.id;
        var item = this.data.productList[index];

        ++item.spec.count;
        ++this.data.productCount;
        this.data.totalPrice += item.spec.price;

        this.setData({
            productList: this.data.productList,
            productCount: this.data.productCount,
            totalPrice: this.data.totalPrice
        })
    },

    minusCount: function(e) {
        var index = e.target.id;
        var item = this.data.productList[index];

        --item.spec.count;
        --this.data.productCount;
        this.data.totalPrice -= item.spec.price;

        if (item.spec.count == 0) {
            item.spec.count = 1
            item.spec.hidden = !item.spec.hidden
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

    onFocusChange: function(e) {
        var item = this.data.productList[e.target.id];

        this.data.productCount -= item.spec.count;
        this.data.totalPrice -= item.spec.count * item.spec.price;

        if (e.detail.value == null || e.detail.value == '') {
            e.detail.value = 0;
        }

        item.spec.count = parseInt(e.detail.value);

        this.data.productCount += item.spec.count;
        this.data.totalPrice += item.spec.count * item.spec.price;

        if (this.data.productCount <= 0) {
            item.spec.count = 1;
            item.spec.hidden = false;
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

    buy: function(e) {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: this.data.title,
            path: '/pages/index/index?id=123',
            imageUrl: this.data.selectedImgUrl
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

})