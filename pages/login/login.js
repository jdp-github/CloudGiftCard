// pages/login/login.js
var util = require('../../utils/util.js');
var minMD5 = require('../../utils/minMD5.js');
var RSA = require('../../utils/wxapp_rsa.js')
var key = require('../../key/id_rsa.js');
// var jsencrpt = require('../../utils/jsencrypt.min.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    // wx.getUserInfo({
                    //     success: function(res) {
                    //         wx.switchTab({
                    //             url: '../index/index'
                    //         })
                    //     }
                    // })
                }
            }
        })
    },

    bindGetUserInfo: function(e) {
        // wx.switchTab({
        //     url: '../index/index'
        // })
        // var that = this;
        // wx.login({
        //   success: function(res) {
        //     // console.log(res.code)
        //     //获取openid
        //     that.getOpenId(res.code)
        //   }
        // });
        // debugger

        wx.getFileInfo({
            filePath: '../../utils/minMD5.js',
            success(res) {
                console.log(res.digest)
            },
            fail(res) {
                console.log(res)
            }
        })

        var key = FileSystemManager.readFileSync('../../key/id_rsa', 'utf-8')
        console.log(key)

        // var sign_rsa = new RSA.RSAKey();
        // sign_rsa = RSA.KEYUTIL.getKey(privateKey_pkcs1);
        // // console.log('签名RSA:')
        // // console.log(sign_rsa)
        // console.log(key.private_key)
        // var hashAlg = 'sha1';
        // var hSig = sign_rsa.signString("lytall.com/magicString/aaa.000000", hashAlg);
        // hSig = rsa.hex2b64(hSig); // hex 转 b64
        // console.log("签名结果：" + hSig)
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
                console.log(openid);
                var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + out_trade_no + '&sign_type=MD5&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key
                //   debugger
                var sign = minMD5(unifiedPayment).toUpperCase()
                console.log(unifiedPayment)

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
                console.log(formData)

                //统一支付
                wx.request({
                    url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
                    method: 'POST',
                    head: 'application/x-www-form-urlencoded',
                    data: formData, // 设置请求的 header
                    success: function(res) {
                        console.log(res)
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
                // fail
            },

            complete: function() {
                // complete
            }
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
    /* 支付   */
    pay: function(param) {
        wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            success: function(res) {
                // success
                console.log("pay success" + res)
                wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                    success: function(res) {
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                        })
                    },
                    fail: function() {
                        // fail
                    },
                    complete: function() {
                        // complete
                    }
                })
            },
            fail: function(res) {
                // fail
                console.log("支付失败")
                console.log(res)
            },
            complete: function() {
                // complete
                console.log("pay complete")
            }
        })
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})