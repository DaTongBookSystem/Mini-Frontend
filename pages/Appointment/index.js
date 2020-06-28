import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
import {showToast} from '../../utils/asyncWx';
// pages/Appointment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    author: '',
    press: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  handleInput: function(e) {
    console.log(e)
    const type = e.target.dataset.text || 'name';
    const value = e.detail.value;
    switch (type) {
      case 'name':
        this.data.name = value
        break;
      case 'author':
        this.data.author = value
        break;
      case 'press':
        this.data.press = value
          break;
      default:
        break;

    }
  },
  async orderbook() {
    const data = await request({url: '/user/orderBook', data: {
      bookName: this.data.name,
      bookAuthor: this.data.author,
      press: this.data.press
    }, method: 'POST'}, true);
    console.log(data);
    await wx.showToast({
      title: '提交成功',
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
       })
    }, 1000);
  },
})