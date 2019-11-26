//login.js
//获取应用实例
var app = getApp();
Page({
    data: {
        remind: '加载中',
        angle: 0,
        userInfo: {},
        islogin: true,


    },
    goToIndex: function () {
        wx.switchTab({
            url: '/pages/food/index',
        });
    },
    onLoad: function () {
        wx.setNavigationBarTitle({
            title: app.globalData.shopName
        })
        this.checkLogin()
    },
    onShow: function () {

    },
    onReady: function () {
        var that = this;
        setTimeout(function () {
            that.setData({
                remind: ''
            });
        }, 1000);
        wx.onAccelerometerChange(function (res) {
            var angle = -(res.x * 30).toFixed(1);
            if (angle > 14) {
                angle = 14;
            } else if (angle < -14) {
                angle = -14;
            }
            if (that.data.angle !== angle) {
                that.setData({
                    angle: angle
                });
            }
        });
    },
    bindGetUserInfo(e) {
        console.log(e.detail.userInfo)
        var that = this
        wx.login({
            success(res) {
                if (res.code) {
                    console.log(res.code)
                    wx.request({

                        url: app.buildUrl('/v1/user/login'),
                        data: {
                            'nickname': e.detail.userInfo.nickName,
                            'code': res.code,
                            'avatarUrl': e.detail.userInfo.avatarUrl,
                            'gender': e.detail.userInfo.gender,
                        },
                        method: "POST",
                        header: app.getRequestHeader(),

                        success(res) {
                            console.log(res.data)
                            if (res.data.code == 1) {

                                that.goToIndex()
                            }
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })

    },
    checkLogin: function (e) {
        wx.login({
            success(res) {
                if (res.code) {
                    console.log(res.code)
                    wx.request({

                        url: app.buildUrl('/v1/user/cklogin'),
                        data: {
                            // 'nickname': e.detail.userInfo.nickName,
                            'code': res.code,
                            // 'avatarUrl': e.detail.userInfo.avatarUrl,
                            // 'gender': e.detail.userInfo.gender,
                        },
                        method: "POST",
                        header: app.getRequestHeader(),

                        success(res) {
                            // console.log(res);
                            if (res.data.code == 1) {
                                app.setToken('token', res.data.data.token)
                                that.setData({
                                    'islogin': true
                                })

                            }
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })


    }
});