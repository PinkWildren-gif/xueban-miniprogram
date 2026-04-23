// app.js — global application logic
App({
  onLaunch() {
    // Runs once when the Mini Program starts
    console.log('学伴 Mini Program launched');

    // Initialize favorites storage if not exists
    if (!wx.getStorageSync('favorites')) {
      wx.setStorageSync('favorites', []);
    }

    // Initialize Double Reduction acknowledgment
    // (if not yet acknowledged, key will be falsy)
  },

  globalData: {
    // Shared app-level state
    userInfo: null,
    currentCity: '昆明',
    currentDistrict: null
  }
})
