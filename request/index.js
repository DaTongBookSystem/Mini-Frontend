const Api = require('../service/api.service');
// 同时发送异步代码的次数
let ajaxTime=0;

const baseUrl = 'http://localhost:8002';
// const baseUrl = 'https://test.zmcm.vip';


export const request = (params, tokenNeeded = true) => {
  let header={};
  if(tokenNeeded) {
    const userInfo = wx.getStorageSync("userinfo");
    console.log(userInfo.token)
    header["authorization"] = 'Bearer ' + userInfo.token;
  }
  
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(result)=>{
        console.log(result)
        const data = result.data;
        if (data.msg === 'invalid token。' && data.code === 401) {
          const userInfo = wx.getStorageSync('userinfo');
          console.log(`userInfo ===`, userInfo);
          getNewToken().then(() => {
            request(params, tokenNeeded).then((result) => {
              console.log(`getNewToken`, result);
              resolve(result);
            });
          })
        }else{
          resolve(result.data.data);
        }
      },
      fail:(err)=>{
        console.log(err)
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

//获取新token
const getNewToken = () => {
  const userInfo = wx.getStorageSync('userinfo');
          console.log(`userInfo ===`, userInfo);
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + '/user/insertUser',
      data: userInfo,
      method: 'post',
      success: function (res) {
        const result = res.data.data;
        console.log(`second result: `, result);
            if (result.token) {
              userInfo.token = result.token;
              console.log('insertUser userInfo:', userInfo);
              // 本地用Storage管理用户信息
              wx.setStorage({
                key: "userinfo",
                data: userInfo,
              });
             resolve(result);
            }else{
              reject(result);
            }
      },
    })
  })
}