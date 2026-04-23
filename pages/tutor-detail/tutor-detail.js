// pages/tutor-detail/tutor-detail.js
const { getTutorById, toggleFavorite, isFavorited } = require('../../utils/data.js');

Page({
  data: {
    tutor: null,
    isFav: false
  },

  onLoad(options) {
    const id = parseInt(options.id || 1);
    const tutor = getTutorById(id);

    if (!tutor) {
      wx.showToast({ title: '老师不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    // Flatten arrays for template display
    const display = {
      ...tutor,
      grades: tutor.grades.join(' · '),
      mode: tutor.mode.join(' / ')
    };

    wx.setNavigationBarTitle({ title: `${tutor.name} 老师` });

    this.setData({
      tutor: display,
      isFav: isFavorited(id)
    });
  },

  onToggleFav() {
    const id = this.data.tutor.id;
    const nowFav = toggleFavorite(id);
    this.setData({ isFav: nowFav });
    wx.showToast({
      title: nowFav ? '已收藏' : '取消收藏',
      icon: 'none',
      duration: 800
    });
  },

  onContact() {
    wx.showModal({
      title: '联系老师',
      content: `即将为您发起与${this.data.tutor.name}老师的沟通。（演示版本：真实版本将打开聊天页面，并推送消息给老师）`,
      showCancel: false
    });
  },

  onShareAppMessage() {
    const t = this.data.tutor;
    return {
      title: `${t.name} 老师 · ${t.school}`,
      path: `/pages/tutor-detail/tutor-detail?id=${t.id}`
    };
  }
});
