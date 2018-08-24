// pages/card/card.js
const util = require('../../utils/util.js')
var base64 = require('../../utils/base64.js');
var minMD5 = require('../../utils/minMD5.js');
var RSA = require('../../utils/wxapp_rsa.js')
var key = require('../../key/id_rsa.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // srcPage: '',
        title: '',
        selectedCard: {},
        productCount: 0,
        totalPrice: 0,
        canBuy: false,

        showDialog: false,
        clickItem: {},
        cardList: [],

        showShare: false,
        productList: [],
        wxOrder: {},
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
        this.setData({
            cardList: JSON.parse(options.cardList),
            selectedCard: JSON.parse(options.selectedCard)
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
                    // console.log(base64.decode(itemObj.value))
                    var item = self.data.productList[i] = JSON.parse(base64.decode(itemObj.value));
                    item.index = i;
                    item.spec.price = parseInt(item.spec.price);
                    item.spec.count = 0;
                }
                self.setData({
                    productList: self.data.productList
                })
            }
        })
    },

    onImageClick: function(e) {
        var target = e.target
        var card = target.dataset.selectedcard

        for (var i = 0; i < this.data.cardList.length; i++) {
            if (i == target.id) {
                this.data.cardList[i].isChecked = true;
            } else {
                this.data.cardList[i].isChecked = false;
            }
        }

        this.setData({
            selectedCard: card,
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
        var index = e.target.id;
        var item = this.data.productList[index];
        item.spec.hidden = !item.spec.hidden;

        ++item.spec.count;
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
            item.spec.count = 0
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target)
        }
        return {
            title: this.data.title,
            path: '/pages/index/index?id=123',
            imageUrl: this.data.selectedCard.spec.logo
        }
    },

    onShareMaskClick: function(res) {
        this.setData({
            showShare: false
        })
    },

    shareOK: function(e) {
        this.setData({
            showShare: false
        })
    },

    shareCancle: function(e) {
        this.setData({
            showShare: false
        })
    },

    // ========================= 购买 begin ========================= //
    buy: function(e) {
        var that = this;
        wx.login({
            success: function(res) {
                // console.log(res.code)
                //获取openid
                that.getOpenId(res.code)
            }
        });
    },

    /* 获取openId */
    getOpenId: function(code) {
        var that = this
        wx.request({
            url: "https://www.lytall.com/v1/wxopenid/" + code,
            method: 'GET',
            success: function(res) {
                //统一支付签名
                // console.log(res);
                var appid = 'wx1a597e61cecd1a6f'; //appid  
                var body = '曲靖市礼道电子商务有限公司'; //商户名
                var mch_id = '1509805691'; //商户号
                var nonce_str = that.randomString(); //随机字符串，不长于32位。  
                var notify_url = 'https://www.lytall.com/v1/wxnotify'; //通知地址
                var out_trade_no = that.getWxPayOrdrID(); // 商户订单号
                var spbill_create_ip = '127.0.0.1'; //ip
                // var total_fee = parseInt(that.data.wxPayMoney) * 100;
                var total_fee = 1;
                var trade_type = "JSAPI";
                var key = 'xiAofAnguAnApimiyAo18lidAo18guAn';
                // debugger
                var openid = JSON.parse(res.data.data).openid;
                // console.log(openid);
                var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + out_trade_no + '&sign_type=MD5&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key
                //   debugger
                var sign = minMD5(unifiedPayment).toUpperCase()
                // console.log(unifiedPayment)

                //封装统一支付xml参数
                var formData = "<xml>"
                formData += "<appid>" + appid + "</appid>"
                formData += "<body>" + body + "</body>"
                formData += "<mch_id>" + mch_id + "</mch_id>"
                formData += "<nonce_str>" + nonce_str + "</nonce_str>"
                formData += "<notify_url>" + notify_url + "</notify_url>"
                formData += "<openid>" + openid + "</openid>"
                formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
                formData += "<sign_type>" + "MD5" + "</sign_type>"
                formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
                formData += "<total_fee>" + total_fee + "</total_fee>"
                formData += "<trade_type>" + trade_type + "</trade_type>"
                formData += "<sign>" + sign + "</sign>"
                formData += "</xml>"
                // console.log(formData)

                that.data.wxOrder.AppID = appid;
                // that.data.wxOrder.CashFee = appid;
                that.data.wxOrder.MchID = mch_id;
                that.data.wxOrder.NonceStr = nonce_str;
                that.data.wxOrder.OpenID = openid;
                that.data.wxOrder.OutTradeNo = out_trade_no;
                that.data.wxOrder.Sign = sign;
                that.data.wxOrder.SignType = 'MD5';
                that.data.wxOrder.TotalFee = total_fee;
                that.data.wxOrder.TradeType = trade_type;
                that.setData({
                    wxOrder: that.data.wxOrder
                })

                //统一支付
                wx.request({
                    url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
                    method: 'POST',
                    head: 'application/x-www-form-urlencoded',
                    data: formData, // 设置请求的 header
                    success: function(res) {
                        that.insertOrder(res);
                        // console.log(that.makeOrderParam(res))
                        // debugger
                        var result_code = that.getXMLNodeValue('result_code', res.data.toString("utf-8"))
                        var resultCode = result_code.split('[')[2].split(']')[0]
                        if (resultCode == 'FAIL') {
                            var err_code_des = that.getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
                            var errDes = err_code_des.split('[')[2].split(']')[0]
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                                success: function(res) {
                                    wx.showToast({
                                        title: errDes,
                                        icon: 'success',
                                        duration: 2000
                                    })
                                },
                            })
                        } else {
                            //发起支付
                            var prepay_id = that.getXMLNodeValue('prepay_id', res.data.toString("utf-8"))
                            var tmp = prepay_id.split('[')
                            var tmp1 = tmp[2].split(']')
                            //签名
                            var key = 'xiAofAnguAnApimiyAo18lidAo18guAn';
                            var appId = 'wx1a597e61cecd1a6f';
                            var timeStamp = that.createTimeStamp();
                            var nonceStr = that.randomString();
                            var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
                            // console.log(stringSignTemp)
                            var sign = minMD5(stringSignTemp).toUpperCase()

                            var param = {
                                "timeStamp": timeStamp,
                                "package": 'prepay_id=' + tmp1[0],
                                "paySign": sign,
                                "signType": "MD5",
                                "nonceStr": nonceStr
                            }
                            that.pay(param)
                        }
                    },
                })
            },

            fail: function() {
                wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000
                })
            },

            complete: function() {
                // complete
            }
        })
    },

    // 插入订单
    insertOrder: function(param) {
        var encrypt_rsa = new RSA.RSAKey();
        encrypt_rsa = RSA.KEYUTIL.getKey(key.public_key);
        var encStr = encrypt_rsa.encrypt("lytall.com/magicString/aaa.000000")
        encStr = RSA.hex2b64(encStr);
        // console.log("加密结果：" + encStr)

        var that = this;
        wx.request({
            url: 'https://www.lytall.com/v1/order',
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Authorization': 'Bearer ' + encStr
            },
            method: 'POST',
			data: that.makeOrderParam(param),
            success: function(res) {
                console.log("成功" + res)
            },
            fail: function(res) {
                console.log("失败" + res)
            }
        })
    },

    json2Form: function json2Form(json) {
        var str = [];
        for (var p in json) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
		console.log(str)
        return str.join("&");
    },

    makeOrderParam: function(payRes) {
        // debugger
        var param = {};
        param.metadata = {};
        param.spec = {};
        param.status = {};
        param.metadata.name = this.data.wxOrder.OutTradeNo;
        param.spec.active = true;
        param.spec.goods = this.makeOrderGoods();
        param.wxOrder = this.data.wxOrder;
        param.status.active = true;
        param.status.process = 'unsent';

        console.log(JSON.stringify(param));
        return param;
    },

    makeOrderGoods: function() {
        var goods = [];
        for (var i = 0, len = this.data.productList.length; i < len; i++) {
            var good = {};
            good.metadata = {};
            good.spec = {};
            good.status = {};
            good.metadata.uid = this.data.productList[i].metadata.uid;
            good.spec.cardUID = this.data.selectedCard.metadata.uid;
            good.spec.number = this.data.productList[i].spec.count;
            good.status.active = true;
            goods[i] = good;
        }
        return goods;
    },

    /** 支付 */
    pay: function(param) {
        wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            success: function(res) {
                // success
                // console.log("pay success" + res)
                wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                    success: function(res) {
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                        })
                        this.setData({
                            showShare: true
                        })
                    },
                    fail: function() {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 2000
                        })
                    },
                    complete: function() {
                        // complete
                    }
                })
            },
            fail: function(res) {
                // fail
                wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function() {}
        })
    },

    // 生成商户订单号
    getWxPayOrdrID: function() {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var mouth = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var hour = myDate.getHours();
        var minute = myDate.getMinutes();
        var second = myDate.getSeconds();
        var msecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
        if (mouth < 10) { /*月份小于10  就在前面加个0*/
            mouth = String(String(0) + String(mouth));
        }
        if (day < 10) { /*日期小于10  就在前面加个0*/
            day = String(String(0) + String(day));
        }
        if (hour < 10) { /*时小于10  就在前面加个0*/
            hour = String(String(0) + String(hour));
        }
        if (minute < 10) { /*分小于10  就在前面加个0*/
            minute = String(String(0) + String(minute));
        }
        if (second < 10) { /*秒小于10  就在前面加个0*/
            second = String(String(0) + String(second));
        }
        if (msecond < 10) {
            msecond = String(String(0) + String(second));
        } else if (msecond >= 10 && msecond < 100) {
            msecond = String(String(0) + String(second));
        }

        var currentDate = String(year) + String(mouth) + String(day) + String(hour) + String(minute) + String(second) + String(msecond);
        return currentDate;
    },

    /* 随机数 */
    randomString: function() {
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = chars.length;
        var pwd = '';
        for (var i = 0; i < 32; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    /* 获取prepay_id */
    getXMLNodeValue: function(node_name, xml) {
        var tmp = xml.split("<" + node_name + ">")
        var _tmp = tmp[1].split("</" + node_name + ">")
        return _tmp[0]
    },

    /* 时间戳产生函数   */
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + ''
    },

    // ========================= 购买 end ========================= //
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