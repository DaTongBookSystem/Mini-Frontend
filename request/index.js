// 同时发送异步代码的次数
let ajaxTime=0;

const baseUrl = 'http://localhost:8002';
// const baseUrl = 'https://test.zmcm.vip';


export const request = (params, tokenNeeded = true) => {
  let header={...params.header};
  if(tokenNeeded) {
    header["Authorization"]=wx.getStorageSync("token");
  }
  
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(result)=>{
          resolve(result.data.data);
      },
      fail:(err)=>{
          reject(err);
      },
      complete:()=> {
        ajaxTime--;
        if(ajaxTime===0){
          // 关闭正在等待的图标
          wx.hideLoading()
        }
      }
    });
})
} 

export const userRequest = (params, tokenNeeded = true) => {
  let header={...params.header};
  if(tokenNeeded) {
    header["Authorization"]=wx.getStorageSync("token");
  }
  
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(result)=>{
          resolve(result.data);
      },
      fail:(err)=>{
          reject(err);
      },
      complete:()=> {
        ajaxTime--;
        if(ajaxTime===0){
          // 关闭正在等待的图标
          wx.hideLoading()
        }
      }
    });
})
} 