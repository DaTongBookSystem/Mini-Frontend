import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import {filterResult} from '../../utils/helper';

// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`onload`)
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
    // 请求后台数据删除Num
    
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