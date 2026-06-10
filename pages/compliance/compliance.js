// pages/compliance/compliance.js — static legal page (合规披露)
// redirectTo (not navigateTo) so legal-page cross-links don't grow the page stack
Page({
  goTerms() {
    wx.redirectTo({ url: '/pages/terms/terms' });
  }
});
