// pages/history/history.js
var base64 = require('../../utils/base64.js');
var RSA = require('../../utils/wxapp_rsa.js')
var key = require('../../key/id_rsa.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isSend: true,
        sentList: [],
        receivedList: [],
        order: {},
        address: {},
        card: {},
        showShare: false,
        // 未送出 已送出 已领取 未领取
        // unsent sent  unreceived  received
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('onload' + options)
        wx.showLoading({
            mask: true
        })
        var that = this;
        wx.login({
            success: function(res) {
                // console.log(res)
                //获取openid
                wx.request({
                    url: "https://www.lytall.com/v1/wxopenid/" + res.code,
                    success: function(res) {
                        var openid = JSON.parse(res.data.data).openid;
                        console.log(openid)
                        if (that.isEmptyObject(options)) {
                            that.requestHistoryList(openid);
                        } else {
                            that.updateOrder(options.orderId, openid);
                        }
                    }
                })
            }
        });
    },

    updateOrder: function(orderId, openid) {
        var that = this;
        wx.request({
            url: 'https://www.lytall.com/v1/receivedStatus/',
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Authorization': 'Bearer ' + that.makeRSAStr()
            },
            method: 'POST',
            data: {
                uid: orderId,
                process: 'unreceived',
                receivedOpenID: openid
            },
            success(res) {
                that.requestHistoryList(openid);
            },
            fail(res) {
                wx.hideLoading();
            }
        })
    },

    // 历史记录
    requestHistoryList: function(openid) {
        var that = this;
        wx.request({
            url: 'https://www.lytall.com/v1/history',
            data: {
                // TODO
                // openid: 'onPlJ5KvbcMw5FIwnXKx0x5NHxoc'
                openid: openid
            },
            success(res) {
                var resObj = JSON.parse(res.data.data);
                for (var i = 0, j = 0, k = 0, len = resObj.kvs.length; i < len; i++) {
                    var itemObj = resObj.kvs[i];
                    var item = JSON.parse(base64.decode(itemObj.value))
                    // console.log(base64.decode(itemObj.value))
                    if (i == 0) {
                        that.requestCard(item.spec.order.spec.goods[i].spec.cardUID);
                    }
                    var process = item.spec.order.status.process;
                    if (process == 'unsent') {
                        item.spec.order.status.text = '未送出';
                        item.spec.order.status.clickable = true;
                    } else if (process == 'sent') {
                        item.spec.order.status.text = '已送出';
                        item.spec.order.status.clickable = false;
                        } else if (process == 'received') {
                        item.spec.order.status.text = '已领取';
                        item.spec.order.status.clickable = false;
                    } else if (process == 'unreceived') {
                        item.spec.order.status.text = '未领取';
                        item.spec.order.status.clickable = true;
                    }

                    if (item.spec.order.spec.receivedOpenID == openid) {// 我收到的
						if (item.spec.order.spec.openIDUsername != '') {
							item.spec.order.status.leftText = item.spec.order.spec.openIDUsername + ' 送出';
						}
						that.data.receivedList[j] = item;
                        j++;
                    } else {// 我送出的
						item.spec.order.status.leftText = item.metadata.creationTimestamp.substring(0, 10) + ' ' + item.metadata.creationTimestamp.substring(11, 19)
                        that.data.sentList[k] = item;
                        k++;
                    }
                }
                // console.log('送出：' + JSON.stringify(that.data.sentList))
                // console.log('收到：' + JSON.stringify(that.data.receivedList))
                that.setData({
                    sentList: that.data.sentList,
                    receivedList: that.data.receivedList,
                })
            },
            complete(res) {
                wx.hideLoading()
            }
        })
    },

    // 获取卡片的title和img
    requestCard: function(cardUid) {
        var that = this
        wx.request({
            url: 'https://www.lytall.com/v1/card',
            data: {
                uid: cardUid
            },
            success(res) {
                var resObj = JSON.parse(res.data.data);
                that.data.card = JSON.parse(base64.decode(resObj.kvs[0].value));
                // console.log(that.data.card)
                that.setData({
                    card: that.data.card
                })
            }
        })
    },

    onCheckChange: function(e) {
        var isSend = e.currentTarget.dataset.issend;
        if (isSend == 'true') {
            this.setData({
                isSend: true
            })
        } else {
            this.setData({
                isSend: false
            })
        }
    },

    // 按钮点击
    onItemClick: function(e) {
        var that = this;
        var item = e.currentTarget.dataset.item;
        this.setData({
            order: item
        })
        // console.log(this.data.order)
        var process = item.spec.order.status.process;
        if (process == 'unsent') { // 未送出
            this.setData({
                showShare: true
            })
        } else if (process == 'unreceived') { // 未领取
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.address']) {
                        wx.openSetting({})
                    } else {
                        //打开选择地址
                        wx.chooseAddress({
                            success: function(res) {
                                that.setData({
                                    address: res
                                })
                                that.insertOrUpdateOrder('received')
                            },
                            fail: function(res) {
                                console.log(res)
                            }
                        })
                    }
                },
                fail(res) {
                    console.log('调用失败')
                }
            })
        }
    },

    // 插入 or 更新订单
    insertOrUpdateOrder: function(process) {
        var that = this;
        wx.request({
            url: 'https://www.lytall.com/v1/order',
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Authorization': 'Bearer ' + that.makeRSAStr()
            },
            method: 'POST',
            data: that.makeOrderParam(process),
            success: function(res) {
                // console.log("成功" + res)
                that.onLoad();
            },
            fail: function(res) {
                // console.log("失败" + res)
            }
        })
    },

    makeRSAStr: function() {
        var encrypt_rsa = new RSA.RSAKey();
        encrypt_rsa = RSA.KEYUTIL.getKey(key.public_key);
        var encStr = encrypt_rsa.encrypt("lytall.com/magicString/aaa.000000")
        encStr = RSA.hex2b64(encStr);
        // console.log("加密结果：" + encStr)
        return encStr;
    },

    makeOrderParam: function(process) {
        // debugger
        var wxOrder = this.data.order.spec.order.spec.wxOrder;
        var param = {};
        param.metadata = {};
        param.spec = {};
        param.status = {};
        param.metadata.name = wxOrder.out_trade_no;
        param.metadata.uid = wxOrder.out_trade_no;
        param.spec.active = true;
        param.spec.goods = this.data.order.spec.order.spec.goods;
        param.spec.wxOrder = wxOrder;
        param.status.active = true;
        param.status.process = process;

        if (!this.isEmptyObject(this.data.address)) {
            var address = this.data.address;
            param.spec.consigneeAddress = address.provinceName + ',' + address.cityName + ',' + address.countyName + ',' + address.detailInfo
            param.spec.consigneePhone = address.telNumber
            param.spec.consignee = address.userName
        }

        console.log(JSON.stringify(param));
        return JSON.stringify(param);
    },

    isEmptyObject: function(e) {
        var t;
        for (t in e)
            return !1;
        return !0
    },

    // ============================== 分享 begin ============================== //
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        // 来自页面内转发按钮
        if (res.from === 'button') {
            return {
                title: this.data.card.metadata.description,
                path: '/pages/history/history?orderId=' + this.data.order.metadata.name,
                imageUrl: this.data.card.spec.logo
            }
        }
    },

    onShareMaskClick: function(res) {
        this.setData({
            showShare: false
        })
    },

    shareOK: function(e) {
        this.insertOrUpdateOrder('sent');
        this.setData({
            showShare: false
        })
    },

    shareCancle: function(e) {
        this.setData({
            showShare: false
        })
    },

    // ============================== 分享 end ============================== //

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