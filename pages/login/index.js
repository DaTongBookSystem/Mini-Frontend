// pages/login/index.js
const Api = require('../../service/api.service');
Page({
  data: {
    user: {openid: ''},
  },

  handleGetUserInfo(e){
    this.getWxUserInfo(e);
  },

  getWxUserInfo(e) {
    let userInfo = e.detail.userInfo;
  return new Promise((resolve, reject) => {
    // 调用接口获取登录凭证（code）
    wx.login({
      success: function (data) {
        // 根据登录凭证获取用户的唯一标识（openid）
        Api.getOpenid(data.code).then((result) => {
          console.log('getWxUserInfo info:', result);
          if (result.code === 200) {
            userInfo.openid = result.data.openid;
            // 根据微信用户信息创建或更新用户，并获取token信息
            Api.insertUser(userInfo).then((result) => {
              if (result.code === 200) {
                userInfo.token = result.data.token;
                console.log('insertUser userInfo:', userInfo);
                // 本地用Storage管理用户信息
                wx.setStorage({
                  key: "userinfo",
                  data: userInfo,
                  success: () => {
                    resolve();
                  }
                });
                wx.navigateBack({
                  delta: 1
                })
              }
            }).catch(() => {
              reject();
              console.log('取消授权，留在本页')
            });
          } else {
            reject();
          }
        }).catch(() => {
          reject();
        })
      },
      fail: function (err) {
        reject();
        console.log('wx login failed', err)
      }
    })
  })
  },

  getOpenid() {
    let _this = this;
    wx.login({
      success: function (data) {
        console.log(`login data:`, data);
        Api.getOpenid(data.code).then((result) => {
          if (result.code === 200) {
            _this.data.user.openid = result.data.openid;
            _this.setData({
              user: _this.data.user
            });
          } else {
          }
        }).catch(() => {
        })
      },
      fail: function (err) {
        console.log('wx login failed', err)
      }
    })
  },

})