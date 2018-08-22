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
          wx.getUserInfo({
            success: function(res) {
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        }
      }
    })
  },

  bindGetUserInfo: function(e) {
    wx.switchTab({
      url: '../index/index'
    })
    // debugger

    // wx.getFileInfo({
    //   filePath: '../../utils/minMD5.js',
    //   success(res) {
    //     console.log(res.digest)
    //   },
    //   fail(res) {
    //     console.log(res)
    //   }
    // })

    // var key = FileSystemManager.readFileSync('../../key/id_rsa', 'utf-8')
    // console.log(key)

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