/*
1 发送请求获取数据
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api previewImage
  3 点击 加入购物车
    1 先绑定点击事件
    2 获取缓存中的购物车数据 数组格式
    3 先判断 当前的商品是否已经存在于 购物车
    4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
    5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓存中
    6 弹出提示
  4 商品收藏
    1 页面 onShow的时候 加载缓存中的商品收藏的数据
    2 判断当前商品是不是被收藏
      1 是 改变页面的图标
      2 不是
    3 点击商品收藏按钮
      1 判断该商品是否存在于缓存数组中
      2 已经存在 把该商品删除
      3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goodsObj: {}
    //商品是否被收藏
    // isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  onShow: function () {
    let pages = getCurrentPages();
    console.log(pages)
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);


  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/book/" + goods_id });
    goodsObj.goods_price = goodsObj.value
    goodsObj.goods_name = goodsObj.name
    goodsObj.goods_introduce = `<img  style="width:100%;height:auto;display: block" src=${goodsObj.descImgUrl}> </img>`;
    goodsObj.pics = goodsObj.imageUrlList.map(imageUrl => {
      return {
        pics_mid: imageUrl
      }
    })
    this.GoodsInfo = {
      goods_id: parseInt(goods_id, 10),
      goods_price: goodsObj.nums,
      goods_name: goodsObj.name,
      goods_introduce: goodsObj.goods_introduce,
      pics: goodsObj.pics
    };
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: this.GoodsInfo.goods_name,
        goods_price: this.GoodsInfo.goods_price,
        // iphone部分手机 不识别 webp图片格式
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    });
  },
  // 点击 加入购物车
  async handleCartAdd() {
    let userinfo
    try {
      userinfo = await request({ url: '/user/userInfo' });
      if (!userinfo) {
        wx.showToast({
          title: '请登录',
          icon: 'none',
          mask: true
        });
        return;
      }
    } catch (err) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        mask: true
      });
      return;
    }

    const userId = userinfo.id;
    const bookId = this.GoodsInfo.goods_id;

    try {
      const response = await request({ url: '/shopcar', method: 'POST', data: { userId, bookId, num: 1 } });
      if (response === 'success') {
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          mask: true
        });
        return;
      }
      wx.showToast({
        title: '加入失败',
        icon: 'none',
        mask: true
      });
    } catch (e) {
      wx.showToast({
        title: '加入失败',
        icon: 'none',
        mask: true
      });
    }

  },
  // 点击 商品收藏图标
  // handleCollect() {
  //   let isCollect = false;
  //   // 1 获取缓存中的商品收藏数组
  //   let collect = wx.getStorageSync("collect") || [];
  //   // 2 判断该商品是否被收藏过
  //   let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
  //   // 3 当index!=-1表示 已经收藏过
  //   if (index !== -1) {
  //     // 能找到 已经收藏过了 在数组中删除该商品
  //     collect.splice(index, 1);
  //     isCollect = false;
  //     wx.showToast({
  //       title: '取消成功',
  //       icon: 'success',
  //       mask: true
  //     });
  //   } else {
  //     // 没有收藏过
  //     collect.push(this.GoodsInfo);
  //     isCollect = true;
  //     wx.showToast({
  //       title: '收藏成功',
  //       icon: 'success',
  //       mask: true
  //     });
  //   }
  //   // 4 把数组存入到缓存中
  //   wx.setStorageSync("collect", collect);
  //   // 5 修改data中的属性 isCollect
  //   this.setData({
  //     isCollect
  //   })
  // },
  // 立即购买
  async handleBuyNow() {

  }

})