//获取应用实例
var commonCityData = require('../../utils/city.js');
var app = getApp();
Page({
    data: {
        provinces: [],
        citys: [],
        districts: [],
        selProvince: '请选择',
        selCity: '请选择',
        selDistrict: '请选择',
        selProvinceIndex: 0,
        selCityIndex: 0,
        selDistrictIndex: 0
    },
    onLoad: function (e) {
        var that = this;
        this.initCityData(1);
    },
    //初始化城市数据
    initCityData:function( level, obj ){
        if (level == 1) {
            var pinkArray = [];
            for (var i = 0; i < commonCityData.cityData.length; i++) {
                pinkArray.push(commonCityData.cityData[i].name);
            }
            this.setData({
                provinces: pinkArray
            });
        } else if (level == 2) {
            var pinkArray = [];
            var dataArray = obj.cityList
            for (var i = 0; i < dataArray.length; i++) {
                pinkArray.push(dataArray[i].name);
            }
            this.setData({
                citys: pinkArray
            });
        } else if (level == 3) {
            var pinkArray = [];
            var dataArray = obj.districtList
            for (var i = 0; i < dataArray.length; i++) {
                pinkArray.push(dataArray[i].name);
            }
            this.setData({
                districts: pinkArray
            });
        }
    },
    bindPickerProvinceChange: function (event) {
        var selIterm = commonCityData.cityData[event.detail.value];
        this.setData({
            selProvince: selIterm.name,
            selProvinceIndex: event.detail.value,
            selCity: '请选择',
            selCityIndex: 0,
            selDistrict: '请选择',
            selDistrictIndex: 0
        });
        this.initCityData(2, selIterm);
    },
    bindPickerCityChange: function (event) {
        var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
        this.setData({
            selCity: selIterm.name,
            selCityIndex: event.detail.value,
            selDistrict: '请选择',
            selDistrictIndex: 0
        });
        this.initCityData(3, selIterm);
    },
    bindPickerChange: function (event) {
        var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
        if (selIterm && selIterm.name && event.detail.value) {
            this.setData({
                selDistrict: selIterm.name,
                selDistrictIndex: event.detail.value
            })
        }
    },
    bindCancel: function () {
        wx.navigateBack({});
    },
    bindSave: function (e) {
    },
    deleteAddress: function (e) {
        var that = this
        var nickname  = e.detail.value.nickName
        var mobile  = e.detail.value.mobile
        var address  = e.detail.value.address
        var province_id = commonCityData.cityData[that.data.selDistrictIndex].id
        var city_id = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id
        if (that.data.data.selDistrictIndex == 0){
            var area_id =0

        }else{
           var area_id = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id

        }
        wx.request({
        url: app.builUrl('v1/address/set'),
        data: {
            nickname:nickname,
            mobile:mobile,
            province_id: province_id,
            province_str:that.data.data.selProvince,
            city_str:that.data.selCity,
            city_id:city_id,
            area_id:area_id,
            area_str:that.data.data.selDistrict,
            address:address,


        },
            method: "POST",
            header: app.getRequestHeader(),

            success (res) {
                console.log(res.data)
                if(res.data.code ==1){
                    that.setData({

                    })

                }
            }
        })

    },
});
