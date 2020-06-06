import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import {filterResult} from '../../utils/helper';
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";

// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    comeFromOrderPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`onload`)
    console.log(options)
    if (options.comeFromOrderPage) {
      this.setData({
        comeFromOrderPage: options.comeFromOrderPage
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    console.log('onshow');
    const addressList = await request({ url: '/address/list', method: 'GET'}, true);
    console.log(addressList)
    this.setData({
      addressList: addressList
    })
  },

  handleItemNumEdit(e) {
    console.log(e);
    // 跳转到address info 页面
    const address = this.data.addressList[e.currentTarget.dataset.index];
    console.log(address);
    wx.navigateTo({
      url: '/pages/Address_information/index?addressInfo=' + JSON.stringify(address),
    })
  },

  async selectAddress(e) {
    console.log(e);
    if (!this.data.comeFromOrderPage) return;
    if (!this.data.addressList.length) {
      await showToast({ title: "请添加地址" });
    }
    console.log(`选择地址`, e);
    // 传递参数回到上一个page
    const pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      address: this.data.addressList[e.currentTarget.dataset.index]
    })
    wx.navigateBack({
      delta: 1
    })

  },

  async deleteItemNum(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id;
    try {
      await request({url: '/address/' + id, method: 'DELETE'}, true)
      // remove id 
      const addressInfo = filterResult(this.data.addressList, {id})
      this.setData({
        addressList: addressInfo
      })
    }catch(error) {
      console.log(`delete address error:`, error);
    }
  },

  async setAddressDefault(e) {
    console.log(e);
    const selectAddressId = e.currentTarget.dataset.id;
    const selectIds = e.detail.value;
    if (selectIds.length) {
      const id = +selectIds[0];
      await request({ url: '/address/updateAddress', method: 'PUT',  data: { id: id, isDefault: true } }, true);
      const addressList = this.data.addressList.map((address) => {
        if (address.id === id) {
          address.isDefault = 1;
        }else{
          address.isDefault = 0;
        }
        return address;
      })
      this.setData({
        addressList: addressList
      })
    }else{
      this.setData({
        addressList: this.data.addressList
      })
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})