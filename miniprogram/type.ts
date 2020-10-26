export interface AppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
    appId: string;
    githubURL: string;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}
