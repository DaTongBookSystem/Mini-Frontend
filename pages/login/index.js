// pages/login/index.js
const api = require('../../request/index')
Page({
  handleGetUserInfo(e){
    // console.log(e);
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo", userInfo);
    api.request(userInfo).then(() => {
      wx.navigateBack({
        delta: 1
      });
    })
  },

})