// pages/user/index.js
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index.js";
Page({
  data: {
    userinfo: {},
    // 被收藏的商品的数量
    collectNums: 0,
  },
  async onShow() {
    // const userinfo=wx.getStorageSync("userinfo");
    await this.getUserInfo();
  },

  async getUserInfo() {
    const userinfo = await request({url: '/user/userInfo', method: 'GET'}, true);
    console.log(`userinfo`, userinfo);
    this.setData({
      userinfo: userinfo
    })
    if (!userinfo.phone) {
      wx.navigateTo({
        url: '/pages/Captcha/index',
      })
    }
  },
});
