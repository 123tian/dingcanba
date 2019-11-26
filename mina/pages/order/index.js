//获取应用实例
var app = getApp();

Page({
    data: {
        // goods_list: [
        //     {
        //         id:22,
        //         name: "小鸡炖蘑菇",
        //         price: "85.00",
        //         pic_url: "/images/food.jpg",
        //         number: 1,
        //     },
        //     {
        //         id:22,
        //         name: "小鸡炖蘑菇",
        //         price: "85.00",
        //         pic_url: "/images/food.jpg",
        //         number: 1,
        //     }
        // ],
        // default_address: {
        //     name: "编程浪子",
        //     mobile: "12345678901",
        //     detail: "上海市浦东新区XX",
        // },
        // yun_price: "1.00",
        // pay_price: "85.00",
        // total_price: "86.00",
        // params: null
        note:''
    },
    onShow: function () {
        var that = this;
    },
    onLoad: function (e) {
        var that = this;
    },
    createOrder: function (e) {
        var that = this
        wx.request({
            url:app.buildUrl('/v1/order/create'),
            data:{
                ids:that.data.ids,
                address_id:that.data.default_address.id,
                note:that.data.note,
            },
            method:'POST',
            header:app.getRequestHeader(),
            success(res) {
                console.log(res.data)
                if (res.data.code == 1) {
                    wx.navigateTo({
                        url: "/pages/my/order_list"
                    });
                }
            }
        })

        // wx.showLoading();
        // var that = this;

    },
    addressSet: function () {
        wx.navigateTo({
            url: "/pages/my/addressSet"
        });
    },
    selectAddress: function () {
        wx.navigateTo({
            url: "/pages/my/addressList"
        });
    },
    getCreateOrder:function () {
        var that = this
        wx.request({
            url:app.buildUrl('/v1/order/index'),
            data:{
                ids:JSON.stringify(that.data.ids),
            },
            method:'POST',
            header:app.getRequestHeader(),
            success(res) {
                console.log(res.data)
                if (res.data.code == 1){
                    that.setData({
                        goods_list:res.data.data.goods_list,
                        default_address:res.data.data.default_address,
                        total_price:res.data.data.total_price,
                        yun_orice:res.data.data.yun_price,
                        pay_price:res.data.data.pay_price,

                    })
                }
            }
        })

    },
    getInput:function(e){
        console.log(e)
        this.setData({
            note:e.detail.value

            })

    },



});
