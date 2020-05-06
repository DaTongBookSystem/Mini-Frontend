import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    // rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0
    // 右侧内容的滚动条距离顶部的距离
    // scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  onLoad: function (options) {
    /*
    0 web中的本地存储 和 小程序中的本地存储的区别
      1 写代码的方式不一样
        web: localStorage.setItem("key","value") localStorage.getItem("key")
        小程序中: wx.getStorageSync("key","value") wx.getStorageSync("key");
      2 存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会调用一下 toString(),把数据变成了字符串 再存入进去
        小程序： 不存在 类型转换这个操作 存什么类型数据进去 获取的就是什么类型
    1 先判断一下本地存储中方有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求
    3 有旧的数据 同时 旧的数据也没有过期 就是用 本地存储中的旧数据即可
    */

    // 1 获取本地存储中的数据 {小程序中存在本地存储 技术}
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if(!Cates){
      //不存在 发送请求获取数据
      this.getCates();
    }else{
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if(Date.now()-Cates.time>1000*10) {
        //重新发送请求
        this.getCates();
      }else{
        //可以使用旧的数据
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v =>v.cat_name);
        // let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList
          // rightContent
        })
      }
    }
  },
  //获取分类数据
  async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res=>{
    //   this.Cates=res.data.message;

    //   //把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});


    //   //构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v =>v.cat_name);
    //   //构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1 使用es7的async await来发送请求
    const res=await request({url:"/home/category/list"});
    // this.Cates=res.data.message;
    this.Cates=res;
    console.log(`getCates`, res);
    // const books = await request({ url: "/book/list" })
    // this.Books = books;
    //把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    // wx.setStorageSync("books", {time:Date.now(),data:this.Books});
    //构造左侧的大菜单数据
    let leftMenuList=this.Cates.map(v =>v.name);
    //构造右侧的商品数据
    // let rightContent= this.fitlerCats(this.Cates);
    // let rightContent = this.Cates.map(v => {
    //   let categoryBooks = { cat_name: v.name }
    //   categoryBooks.children = this.Books.filter(book => {
    //     return (book.category || []).includes(v.id)
    //   }).map(book => {
    //     return {
    //       cat_name: book.name,
    //       cat_id: book.id,
    //       cat_icon: book.mainImgUrl
    //     }
    //   })
    //   return categoryBooks;
    // })
    this.setData({
      leftMenuList,
    })
  },
  // 左侧菜单的点击事件
  // handleItemTap(e){
  //       /*
  //       1 获取被点击的标题身上的索引
  //       2 给data中的currentIndex赋值
  //       3 根据不同的索引来渲染右侧的商品内容
  //       */
  //   const{index}=e.currentTarget.dataset;
  //   console.log(this.Cates[index])
  //   // let rightContent = this.fitlerCats([this.Cates[index]])
  //   // console.log(rightContent)
  //   // this.setData({
  //   // // currentIndex: index,
  //   // rightContent,
  //   // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
  //   // scrollTop:0
  //   // })
  // }
  // 根据分类获取书籍
//   fitlerCats(cates) {
//     return cates.map(v => {
//       let categoryBooks = { cat_name: v.name }
//       categoryBooks.children = this.Books.filter(book => {
//         return (book.category || []).includes(v.id)
//       }).map(book => {
//         return {
//           cat_name: book.name,
//           cat_id: book.id,
//           cat_icon: book.mainImgUrl
//         }
//       })
//       return categoryBooks;
//     })
//   }
})