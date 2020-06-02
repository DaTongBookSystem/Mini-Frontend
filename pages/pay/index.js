/*
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据 checked=true
2 微信支付
  1 哪些人 哪些账号 可以实现微信支付
    1 企业账号
    2 企业账号的小程序后台中 必须 给开发者 添加上白名单
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token
  3 有token
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面
*/
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    userInfo: {},
    trafficTicketCount: ''
  },
  async onShow() {
    // 1 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    console.log(`address`, address);
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    console.log(cart);
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked === true);
    console.log(cart);
    this.setData({ address });

    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
    });
    await this.getUserInfo()
  },
  // 点击 收货地址
  async handleChooseAddress(){
    try {
      // 1 获取 权限状态
      const res1=await getSetting();
      const scopeAddress =res1.authSetting["scope.address"];
      // 2 判断 权限状态
      if(scopeAddress===false){
        await openSetting();
      }
      // 4 调用获取收获地址的 api
      let address=await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 5 存入到缓存中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },

  async getUserInfo() {
    const userinfo = await request({url: '/user/userInfo', method: 'GET'}, true);
    console.log(`userinfo`, userinfo);
    this.setData({
      trafficTicketCount: userinfo.trafficTicketCount
    })
  },

  // 点击 支付
  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token
      const userInfo = wx.getStorageSync("userinfo");
      // 2 判断
      if (!userInfo.token) {
        wx.navigateTo({
          url: "/pages/auth/index"
        });
        return;
      }
      // 3 创建订单
      // 3.1 准备 请求头参数
      // const header={Authorization:token};
      // 3.2 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v =>
        goods.push({
          bookId: v.goods_id,
          bookNum: v.num,
          bookPrice: v.goods_price,
          bookName: v.goods_name,
          bookSmallPic: v.goods_small_logo
        })
      );
      const {
        telNumber,
        cityName,
        countyName,
        postalCode,
        provinceName,
        userName
      } = this.data.address;
      const orderParams = {
        totalPrice: order_price,
        addressInfo: {
          address: consignee_addr,
          telNumber,
          cityName,
          countyName,
          postalCode,
          provinceName,
          userName
        },
        details: goods
      };
      console.log(`orderParams`, orderParams);
      
      // 4 准备 发送请求 创建订单 获取订单编号
      const { id } = await request({
        url: "/order/create",
        method: "POST",
        data: orderParams,
      }, true);
      // 5 发起 预支付接口
      const data = await request({
        url: "/wxapi/wxpay",
        method: "POST",
        data: {
          orderId: id
        }
      });
      // console.log(`发起 预支付接口`, data)
      // const pay = {
      //   timeStamp: data.timeStamp,
      //   nonceStr: data.nonceStr,
      //   // package: data.package,
      //   package: 'prepay_id=' + data.prepayId,
      //   signType: 'MD5',
      //   paySign: data.paySign,
      // }
      // // 6 发起 微信支付
      // await requestPayment(pay);
      
      // // 7 支付成功 更新订单状态
      // await request({
      //   url: "/order/updateOrder",
      //   method: "PUT",
      //   data: {
      //     status: 2,
      //     id
      //   }
      // }, true)

      await showToast({ title: "购书成功" });
      wx.navigateTo({
        url: '/pages/order/index?status=2',
      })
      return;
      // 8 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 8 支付成功了 跳转到订单页面
      wx.navigateTo({
        url: "/pages/order/index"
      });
    } catch (error) {
      await request({
        url: "/order/updateOrder",
        method: "PUT",
        data: {
          status: 1
        }
      }, true)
      await showToast({ title: "购书失败" });
      wx.redirectTo({
        url: '/pages/order/index?status=1',
      })
      console.log(error);
    }
  }
});
