import { getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
import {formatDate} from '../../utils/helper'


Page({
  data:{
    // address:{},
    // cart:[],
    // totalPrice:0,
    // totalNum:0,
    userinfo:{},
    vip: 0,
    vipList: []
  },
  async onLoad() {
  },
  async onShow(){
    await this.getVipList(); 
    // 获取用户信息
    const userinfo=wx.getStorageSync("userinfo");

    // // 1 获取缓存中的收货地址
    // const address=wx.getStorageSync("address");
    // // 1 获取缓存中的购物车数据
    // let cart=wx.getStorageSync("cart")||[];
    // // 过滤后的购物车数组
    // cart=cart.filter(v=>v.checked);
    // this.setData({address});

    //   // 1 总价格 总数量
    //   let totalPrice=0;
    //   let totalNum=0;
    //   cart.forEach(v => {
    //       totalPrice+=v.num*v.goods_price;
    //       totalNum+=v.num;
    //   })
    await this.getUserInfo()
    
  },

  async getUserInfo() {
    const userinfo = await request({url: '/user/userInfo', method: 'GET'}, true);
    console.log(`userinfo`, userinfo);
    userinfo.vipName = this.judgeVipType(userinfo);
    
    if (new Date(userinfo.vipExpiredAt) > new Date()) {
      userinfo.vipExpiredAt = formatDate(new Date(userinfo.vipExpiredAt))
    }else{
      userinfo.vipExpiredAt = formatDate(new Date(userinfo.vipExpiredAt)) + '(已过期)'
    }
    this.setData({
      userinfo: userinfo
    })
  },
  judgeVipType(userinfo) {
    const vipType = userinfo.vipType;
    console.log(vipType);
    let vipInfo;
    this.data.vipList.forEach((vipTypeInfo) => {
      console.log(vipTypeInfo);
      if (vipTypeInfo.id === vipType) {
        vipInfo = vipTypeInfo;
      }
    })
    return vipInfo.name;
  },

  // 点击 支付
   async handleOrderPay(){
    try {
    // 1 判断缓存中有没有token
    const token=wx.getStorageSync("token");
    // 2 判断
    if(!token){
      // wx.navigateTo({
      //   url: '/pages/auth/index',
      // });
      return;
    }
    // // 3 创建订单
    // // 3.1 准备 请求头参数
    // const header={Authorization:token};
    // // 3.2 准备 请求体参数
    // const order_price=this.data.totalPrice;
    // const consignee_addr=this.data.address.all;
    // const cart=this.data.cart;
    // let goods=[];
    // cart.forEach(v=>goods.push({
    //   goods_id:v.goods_id,
    //   goods_number:v.num,
    //   goods_price:v.goods_price
    // }))
    // const orderParams={order_price,consignee_addr,goods};
    // // 4 准备 发送请求 创建订单 获取订单编号
    // const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams});
    // // 5 发起 预支付接口
    // const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:order_number});

    const result = await request({url: '/wxapi/wxpayVip', method:"POST", data: {
      vipType: 5
    }})
    console.log(`wx pay:`, result)
    // // 6 发起 微信支付
    // await requestPayment(pay);
    // // 7 查询后台 订单状态
    // const res=await request({url:"/my/orders/chkOrder",method:"POST",data:order_number});
    // await showToast({title:"支付成功"});
    // // 8 手动删除缓存中 已经支付了的商品
    // let newCart=wx.getStorageSync("cart");
    // newCart=newCart.filter(v=>!v.checked);
    // wx.setStorageSync("cart", newCart);
    // // 8 支付成功了 跳转到订单页面
    // wx.navigateTo({
    //   url:"/pages/order/index"
    // });
    } catch (error) {
      await showToast({title:"支付失败"});
      console.log(error);
    }
  },

  async testPay() {
  
    const data = await request({url: '/wxapi/wxpayVip', method:"POST", data: {
      vipTypeId: this.data.vip
    }}, true)
    console.log(`wx pay:`, data);
    const pay = {
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      // package: data.package,
      package: 'prepay_id=' + data.prepayId,
      signType: 'MD5',
      paySign: data.paySign,
    }
    // 6 发起 微信支付
    const result = await requestPayment(pay);
    console.log(result)
    if (result.errMsg && result.errMsg === 'requestPayment:ok') {
      await request({url: '/user/updateUserPayVip', method: 'POST', data: {
        vipTypeId: this.data.vip
      }}, true);
          // 7 查询后台 订单状态
    await showToast({title:"支付成功"});
    }

  },

  async getVipList() {
    const data = await request({url: '/user/vip/list', method: 'GET'})
    console.log(`getVipList`, data)
    this.setData({
      vipList: data
    }) 
  },

  async buyVip(e) {
    console.log(e);
    this.setData({
      vip: e.currentTarget.dataset.id
    })
  },


  
  


})