// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        Value:"收藏的书",
        isActive:true
      },
      {
        id:1,
        Value:"出版社收藏",
        isActive:false
      },
      {
        id:2,
        Value:"收藏的书店",
        isActive:false
      },
      {
        id:3,
        Value:"浏览足迹",
        isActive:false
      }
    ]
  },
  onShow(){
    const collect=wx.getStorageSync("collect")||[];
    this.setData({
      collect
    });
  },
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i==index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  }
})