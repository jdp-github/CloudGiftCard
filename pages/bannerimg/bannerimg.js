// pages/bannerimg/bannerimg.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        forwardURL: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '礼道心选'
        })
        this.setData({
            forwardURL: options.forwardURL
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
		if (res.from === 'button') {
			
		} else {
			return {
				title: '微信送礼，一秒送达，快来体验吧！',
				path: '/pages/index/index'
			}
		}
    }
})