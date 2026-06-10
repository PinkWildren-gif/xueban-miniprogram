// pages/privacy/privacy.js — static legal page (隐私政策)
// redirectTo (not navigateTo) so legal-page cross-links don't grow the page stack
Page({
  goTerms() {
    wx.redirectTo({ url: '/pages/terms/terms' });
  }
});
