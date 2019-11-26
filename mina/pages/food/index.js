//index.js
//获取应用实例
var app = getApp();
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false, // loading
        swiperCurrent: 0,
        categories: [],
        activeCategoryId: 0,
        goods: [],
        scrollTop: "0",
        loadingMoreHidden: true,
        searchInput: '',
        page:1,
        ismore:1,
        isloading:1,
    },
    onLoad: function () {
        var that = this;

        wx.setNavigationBarTitle({
            title: app.globalData.shopName
        });

        that.setData({
            // banners: [
            //     {
            //         "id": 1,
            //         "pic_url": "/images/food.jpg"
            //     },
            //     {
            //         "id": 2,
            //         "pic_url": "/images/food.jpg"
            //     },
            //     {
            //         "id": 3,
            //         "pic_url": "/images/food.jpg"
            //     }
            // ],
            // categories: [
            //     {id: 0, name: "全部"},
            //     {id: 1, name: "川菜"},
            //     {id: 2, name: "东北菜"},
            // ],
            activeCategoryId: 0,
			// goods: [
			//                 {
			//                     "id": 1,
			//                     "name": "小鸡炖蘑菇-1",
			//                     "min_price": "15.00",
			//                     "price": "15.00",
			//                     "pic_url": "/images/food.jpg"
			//                 },
			//                 {
			//                     "id": 2,
			//                     "name": "小鸡炖蘑菇-1",
			//                     "min_price": "15.00",
			//                     "price": "15.00",
			//                     "pic_url": "/images/food.jpg"
			//                 },
			//                 {
			//                     "id": 3,
			//                     "name": "小鸡炖蘑菇-1",
			//                     "min_price": "15.00",
			//                     "price": "15.00",
			//                     "pic_url": "/images/food.jpg"
			//                 },
			//                 {
			//                     "id": 4,
			//                     "name": "小鸡炖蘑菇-1",
			//                     "min_price": "15.00",
			//                     "price": "15.00",
			//                     "pic_url": "/images/food.jpg"
			//                 }
            //
			//  ],
            loadingMoreHidden: true
        });
        this.getBannersAndCategory()
        this.getFoods()
    },
    scroll: function (e) {
        var that = this, scrollTop = that.data.scrollTop;
        that.setData({
            scrollTop: e.detail.scrollTop
        });
    },
    //事件处理函数
    swiperchange: function (e) {
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
	listenerSearchInput:function( e ){
	        this.setData({
	            searchInput: e.detail.value
	        });
	 },
	 toSearch:function( e ){
	        this.setData({
	            p:1,
	            goods:[],
	            loadingMoreHidden:true
	        });
	        this.getFoodList();
	},
    tapBanner: function (e) {
        if (e.currentTarget.dataset.id != 0) {
            wx.navigateTo({
                url: "/pages/food/info?id=" + e.currentTarget.dataset.id
            });
        }
    },
    toDetailsTap: function (e) {
        console.log(e)
        wx.navigateTo({
            url: "/pages/food/info?id=" + e.currentTarget.dataset.id
        });

    },
    onReachBottom:function(){
        if(this.data.isloading == 0){
            if(this.data.ismore == 1){
                this.setData({
                    page:this.data.page + 1
                })
                this.getFoods()
            }

        }

    },
    catclick:function(e){
        console.log(e)
        this.setData({
            activeCategoryId:e.currentTarget.id,
            page:1
        })
        this.getFoods() //调用方法
    },

    getBannersAndCategory: function () {
        var that = this
        wx.request({
            url:app.buildUrl('/v1/food/index'),
            method: 'GET',
            header: app.getRequestHeader(),
            success(res) {
                // console.log(res.data)
                if (res.data.code == 1) {
                    that.setData({
                        banners: res.data.data.banners,
                        categories: res.data.data.categories
                    })

                }
            }
        })

    },
    getFoods: function () {
        var that = this
        that.setData({
            isloading: 1
        })
        wx.request({
            url:app.buildUrl('/v1/food/all'),
            method: 'GET',
            data:{
                'cid':that.data.activeCategoryId,
                'page':that.data.page
            },
            header: app.getRequestHeader(),
            success(res) {
                console.log(res.data)
                if (res.data.code == 1) {
                    that.setData({
                        // goods:that.data.goods.concat(res.data.data.goods),
                        goods:res.data.data.goods,
                        ismore:res.data.data.ismore,
                        isloading:0
                    })
                    if (res.data.data.ismore== 0){
                        that.setData({
                            loadingMoreHidden:false
                        })
                    }
                }
            }
        })

    }

});
