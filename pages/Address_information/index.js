import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/Address_information/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    isEdit: false,
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`addressinfo onload.....`)
    if (options.addressInfo) {
      const address = JSON.parse(options.addressInfo);
      this.setData({
        addressInfo: address,
        isEdit: true
      })
    }
    
  },

  recordInput: function (e) {
    console.log(e)
    const type = e.target.dataset.text || 'phone';
    const value = e.detail.value;
    const { addressInfo } = this.data;
    switch (type) {
      case 'receiver':
        addressInfo.receiver = value
        break;
      case 'phone':
        addressInfo.phone = value
        break;
      case 'area':
          addressInfo.area = value
          break;
      case 'detail':
        addressInfo.detail = value
        break;
      case 'postCode':
        addressInfo.postCode = value
        break;
      default:
        break;

    }
    const { receiver, phone, detail, postCode } = this.data.addressInfo;
    if (receiver && phone && detail && postCode) {
      this.setData({
        addressInfo: this.data.addressInfo,
        disabled: false
      })
    }else{
      this.setData({
        addressInfo: this.data.addressInfo,
        disabled: true
      })
    }
    
  },

  async submitAddressInfo() {
    console.log(this);

    const { receiver, phone, detail, postCode, area } = this.data.addressInfo;
    if (!receiver || !phone || !detail || !postCode || !area) {
      return;
    }
    try{
      if (this.data.isEdit) {
        await request({ url: '/address/updateAddress', method: 'PUT',  data: { id:this.data.addressInfo.id, receiver, phone, detail, postCode, area } }, true);
      }else{
        await request({ url: '/address', method: 'POST',  data: { receiver, phone, detail, postCode, area } }, true);
      }
      wx.navigateBack({
        delta: 1
      })
    }catch(error) {
      console.log(`create address error`, error)
    }
    
  }

  
})