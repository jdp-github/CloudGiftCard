//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        background: ['', '', ''],
        interval: 5000,
        duration: 500,
        imgSrc: ['../../images/5.jpg', '../../images/4.jpg'],

        dataList: [
            [
                {
                    id: 0,
                    imgUrl: '../../images/1.jpg',
                    text: "冰沁心甜夏天见"
                },
                {
                    id: 1,
                    imgUrl: '../../images/2.jpg',
                    text: "妈妈，我想对你说"
                }
            ],
            [
                {
                    id: 2,
                    imgUrl: '../../images/3.jpg',
                    text: "哈哈哈"
                },
                {
                    id: 3,
                    imgUrl: '../../images/4.jpg',
                    text: "呵呵呵呵"
                }
            ],
            [
                {
                    id: 4,
                    imgUrl: '../../images/5.jpg',
                    text: "4444444"
                },
                {
                    id: 5,
                    imgUrl: '../../images/1.jpg',
                    text: "5555555"
                }
            ],
            [
                {
                    id: 6,
                    imgUrl: '../../images/5.jpg',
                    text: "6666"
                },
                {
                    id: 7,
                    imgUrl: '../../images/1.jpg',
                    text: "77777"
                }
            ],
        ],
    },
    changeProperty: function (e) {
        var propertyName = e.currentTarget.dataset.propertyName
        var newData = {}
        newData[propertyName] = e.detail.value
        this.setData(newData)
    },
    onLoad: function () {
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '星巴克用星说',
            path: 'pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    navigate: function (e) {
        wx.navigateTo({
            url: '../gift/gift?id=' + e.currentTarget.dataset.id + '&text=' + e.currentTarget.dataset.text
        })
    },
})
