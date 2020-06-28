import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
import {showToast} from '../../utils/asyncWx';

// pages/Captcha/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: ''
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
    const type = e.target.dataset.text || 'phone';
    const value = e.detail.value;
    switch (type) {
      case 'phone':
        this.data.phone = value
        break;
      case 'code':
        this.data.code = value
        break;
      default:
        break;

    }
  },
  async getSmsCode() {
    const result = await request({url: '/user/sendSmsCode', data: {
      phone: this.data.phone
    }, method: 'POST'}, true)
    console.log(result)
  },
  async authenticate() {
    const {phone, code} = this.data;
    if (phone && code) {
      const res = await request({url: '/user/updateUser',data: {
        phone: this.data.phone
      }, method:'POST'}, true)
      if (res === 'success') {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
})