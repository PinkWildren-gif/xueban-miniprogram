// pages/terms/terms.js — static legal page (服务条款)
// Cross-links between legal pages use redirectTo (replace, not push) so
// bouncing between them can't overflow WeChat's 10-page stack.
Page({
  goPrivacy() {
    wx.redirectTo({ url: '/pages/privacy/privacy' });
  },
  goCompliance() {
    wx.redirectTo({ url: '/pages/compliance/compliance' });
  }
});
