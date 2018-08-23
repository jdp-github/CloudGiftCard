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
                    //   wx.getUserInfo({
                    //     success: function(res) {
                    //       wx.switchTab({
                    //         url: '../index/index'
                    //       })
                    //     }
                    //   })
                }
            }
        })
    },

    bindGetUserInfo: function(e) {
        // wx.switchTab({
        //   url: '../index/index'
        // })

        var encrypt_rsa = new RSA.RSAKey();
        encrypt_rsa = RSA.KEYUTIL.getKey(key.public_key);
        // debugger
        // console.log('加密RSA:')
        // console.log(encrypt_rsa)
        var encStr = encrypt_rsa.encrypt("lytall.com/magicString/aaa.000000")
        encStr = RSA.hex2b64(encStr);
        // console.log("加密结果：" + encStr)

        wx.request({
            url: 'https://www.lytall.com/v1/orders',
            header: {
                'content-type': 'application/json', // 默认值
                'Authorization': 'Bearer ' + encStr
            },
			// data:{
			// 	uid:'ssss'
			// },
            success: function(res) {
                console.log(res.data)
            },
            fail: function(res) {
                console.log(res)
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