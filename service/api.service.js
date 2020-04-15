
// import config from '../config';
const {request} = require('../request/index')

/** 用户管理 */
// 从微信获取openid
const getOpenid = (code) => request({url: `/mini/getOpenid?code=${code}`})
// 创建用户,用户授权时使用
const insertUser = (user) => request({url: '/user/insertUser', data: user, method: 'POST'})
// // 获取用户信息
// const getUserInfo = (openid) => httpServer.get({ url: `/user/userInfo` });
// // 更新用户信息
// const updateUser = (user) => httpServer.post({ url: `/user/updateUser`, data: user });
// // 获取access_token
// const getAccessToken = () => httpServer.get({ url: '/mini/getAccessToken' });
// // 获取用户信息
// const getUserDetail = (id) => httpServer.get({ url: `/user/getUserInfo?id=${id}` });

// /** 产品管理 */
// const getProductById = (id) => httpServer.get({ url: `/product/${id}` });
// const getProductList = () => httpServer.get({ url: `/product/list` });

// /** 订单管理 */
// const createOrder = (params) => httpServer.post({ url: `/order`,data:params });
// const getOrderLists = (status) => httpServer.get({ url: `/order/getOrderLists/${status}` });
// const getOrderCount = () => httpServer.get({ url: `/order/countOrder`});
// const getOrderById = (id) => httpServer.get({ url: `/order/${id}` });
// // 获取定制信息
// const getCustomizeById = (id) => httpServer.get({ url: `/order/customize/${id}` });
// const updateOrder = (params) => httpServer.put({ url: `/order/updateOrder`, data: params});

// /** 地址管理 */
// const addAddress = (params) => httpServer.post({ url: `/address`, data: params });
// const getAddressList = () => httpServer.get({ url: `/address/list` });
// const getAddressById = (id) => httpServer.get({ url: `/address/${id}` });
// const updateAddress = (params) => httpServer.put({ url: `/address/updateAddress`, data: params });
// const delAddress = (id) => httpServer.delete({ url: `/address/${id}`});

// /** 订单物流 */
// const getOrderLogistics = (orderId) => httpServer.get({ url: `/order/logistics/${orderId}` });

// /** 付款 */
// const payOrder = (params) => httpServer.post({ url: `/wxapi/wxpay`, data: params });

export {
  getOpenid,
  insertUser,
  // updateUser,
  // getUserInfo,
  // getAccessToken,
  // getUserDetail,
  // getProductById,
  // getProductList,
  // createOrder,
  // getOrderById,
  // updateOrder,
  // getOrderLists,
  // getOrderCount,
  // addAddress,
  // getAddressList,
  // getAddressById,
  // updateAddress,
  // delAddress,
  // getCustomizeById,
  // getOrderLogistics,
  // payOrder,
}

