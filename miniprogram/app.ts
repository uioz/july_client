import { AppOption } from "./type";

interface UserDetail {
  globalData: {
    userDetail: unknown;
  };
}

const USER_DETAIL_STORAGE_KEY = "userdetail";

// app.ts
App<AppOption & UserDetail>({
  globalData: {
    appId: "wx0611fd1ba2b0bcd6",
    githubURL: `https://github.com/uioz/july_client/tree/dev`,
    userDetail: undefined,
  },
  onLaunch() {
    // 拉取缓存的用户信息
    this.globalData.userDetail =
      wx.getStorageSync(USER_DETAIL_STORAGE_KEY) || undefined;

    // // 展示本地存储能力
    // const logs = wx.getStorageSync("logs") || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync("logs", logs);

    // // 登录
    // wx.login({
    //   success: (res) => {
    //     console.log(res.code);
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   },
    // });
    // // 获取用户信息
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting["scope.userInfo"]) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: (res) => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res);
    //           }
    //         },
    //       });
    //     }
    //   },
    // });
  },
});
