//index.js
var app = getApp();
Page({
    data: {},
    onLoad: function () {

    },
    onShow:function(){
        this.getCartList();
    },
    //每项前面的选中框
    selectTap: function (e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        if (index !== "" && index != null) {
            list[parseInt(index)].active = !list[parseInt(index)].active;
            this.setPageData(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
        }
    },
    //计算是否全选了
    allSelect: function () {
        var list = this.data.list;
        var allSelect = false;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            if (curItem.active) {
                allSelect = true;
            } else {
                allSelect = false;
                break;
            }
        }
        return allSelect;
    },
    //计算是否都没有选
    noSelect: function () {
        var list = this.data.list;
        var noSelect = 0;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            if (!curItem.active) {
                noSelect++;
            }
        }
        if (noSelect == list.length) {
            return true;
        } else {
            return false;
        }
    },
    //全选和全部选按钮
    bindAllSelect: function () {
        var currentAllSelect = this.data.allSelect;
        var list = this.data.list;
        for (var i = 0; i < list.length; i++) {
            list[i].active = !currentAllSelect;
        }
        this.setPageData(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
    },
    //加数量
    jiaBtnTap: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var list = that.data.list;

        wx.request({
            url: app.buildUrl('/v1/cart/add'),
            data: {
                id: list[parseInt(index)].food_id,
                number: 1,
                flag: 1
            },
            method: 'POST',
            header: app.getRequestHeader(),
            success(res) {
                console.log(res.data)
                if (res.data.code == 1) {
                    list[parseInt(index)].number++
                    that.setPageData(that.getSaveHide(), ththatis.totalPrice(), that.allSelect(), that.noSelect(), that.data.list);
                }
            }
        })

    },
    //减数量
    jianBtnTap: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        if (list[parseInt(index)].number > 1) {
            wx.request({
                url: app.buildUrl('/v1/cart/add'),
                data: {
                    id: list[parseInt(index)].food_id,
                    number: -1,
                    flag: 1
                },
                method: 'POST',
                header: app.getRequestHeader(),
                success(res) {
                    console.log(res.data)
                    if (res.data.code == 1) {
                        list[parseInt(index)].number--
                        that.setPageData(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), that.data.list);
                    }
                }
            })

            this.setPageData(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), this.data.list);

        }
    },

    //编辑默认全不选
    editTap: function () {
        var list = this.data.list;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            curItem.active = false;
        }
        this.setPageData(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    },
    //选中完成默认全选
    saveTap: function () {
        var list = this.data.list;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            curItem.active = true;
        }
        this.setPageData(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    },
    getSaveHide: function () {
        return this.data.saveHidden;
    },
    totalPrice: function () {
        var list = this.data.list;
        var totalPrice = 0.00;
        for (var i = 0; i < list.length; i++) {
            if (!list[i].active) {
                continue;
            }
            totalPrice = totalPrice + parseFloat(list[i].price) * parseFloat(list[i].number);
        }
        return totalPrice.toFixe(2);
    },
    setPageData: function (saveHidden, total, allSelect, noSelect, list) {
        this.setData({
            list: list,
            saveHidden: saveHidden,
            totalPrice: total,
            allSelect: allSelect,
            noSelect: noSelect,
        });
    },
    //去结算
    toPayOrder: function () {
        wx.navigateTo({
            url: "/pages/order/index"
        });
    },
    //如果没有显示去光光按钮事件
    toIndexPage: function () {
        wx.switchTab({
            url: "/pages/food/index"
        });
    },
    //选中删除的数据
    deleteSelected: function () {
        var list = this.data.list;
        var cart_ids = [];
        list = list.filter(function (item) {
            if (!item.active) {
                cart_ids.concat(item.id);
            }
            return !item.active;
        });
        this.setPageData(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
        //发送请求到后台删除数据
        wx.request({
            url: app.buildUrl('/v1/cart/delete'),
            data: {
                id: JSON.parse(cart_ids),
            },
            method: 'POST',
            header: app.getRequestHeader(),
            success(res) {
                console.log(res.data)
                if (res.data.code == 1) {
                    that.setPageData(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), that.data.list);

                }
            }

        })
    },
    getCartList: function () {
        this.setData({
            list: [
                // {
                //     "id": 1080,
    			// 	"food_id":"5",
                //     "pic_url": "/images/food.jpg",
                //     "name": "小鸡炖蘑菇-1",
                //     "price": "85.00",
                //     "active": true,
                //     "number": 1
                // },
                // {
                //     "id": 1081,
    			// 	"food_id":"6",
                //     "pic_url": "/images/food.jpg",
                //     "name": "小鸡炖蘑菇-2",
                //     "price": "85.00",
                //     "active": true,
                //     "number": 1
                // }
            ],
            saveHidden: true,
            totalPrice: "85.00",
            allSelect: true,
            noSelect: false,
        });
        this.setPageData( this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), this.data.list);
    },

    getCartList: function () {
        var that = this
        wx.request({
            url: app.buildUrl('/v1/cart/list'),
            method: 'GET',
            header: app.getRequestHeader(),
            success(res) {
                console.log(res.data)
                if (res.data.code == 1) {
                    that.setData({
                        list: res.data.data.list,
                        saveHidden: true,
                        totalPrice: res.data.data.toralPrice,
                        allSelect: true,
                        noSelect: false,
                    });
                    that.setPageData(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), this.data.list);
                }

            }

        })
    }

});
