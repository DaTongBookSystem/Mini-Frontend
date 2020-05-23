/*
1 页面被打开的时候 onShow
  0 onShow 不同于onLoad 无法在形参上接受 options参数
  0.5 判断缓存中有没有token
    1 没有 直接跳转到授权页面
    2 有 直接往下进行
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据
 */

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,
    orders:[],
    tabs:[
      {
        id:1,
        Value:"待付款",
        isActive:true
      },
      {
        id:2,
        Value:"配送中",
        isActive:false
      },
      {
        id:3,
        Value:"借阅中",
        isActive:false
      },
      {
        id:4,
        Value:"待回收",
        isActive:false
      },
      {
        id:5,
        Value:"历史订单",
        isActive:false
      }
    ]
  },
  onShow(options){
    const token=wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   });
    //   return;
    // }
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages =  getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPages=pages[pages.length-1];
    // 3 获取url上的type参数
    const {type}=currentPages.options;
    // 4 激活选中页面标题 当 type=1 index=0
    this.changeTitleByIndex(type-1);
    this.getOrders(type);

  },
  // 获取订单列表的方法
  async getOrders(type){
    
    const res = await request({url:`/order/getOrderLists/${type}`,method: 'GET'}, true)
    console.log(res);
    this.setData({
      orders:res.map(v=>({...v, created_at: new Date(v.created_at).toLocaleString()}))
    })
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    // 2 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i==index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs,
      status:index+1
    })
  },
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index+1);
  }

  
})