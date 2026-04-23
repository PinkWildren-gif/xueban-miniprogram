// pages/my/my.js
const { TUTORS, getFavorites } = require('../../utils/data.js');

Page({
  data: {
    favTutors: []
  },

  onShow() {
    // Refresh favorites each time tab is opened
    const favIds = getFavorites();
    const favTutors = TUTORS.filter(t => favIds.includes(t.id));
    this.setData({ favTutors });
  },

  goTutor(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/tutor-detail/tutor-detail?id=${id}` });
  },

  goTutors() {
    wx.switchTab({ url: '/pages/tutors/tutors' });
  }
});
