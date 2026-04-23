// pages/index/index.js
const { TUTORS } = require('../../utils/data.js');

Page({
  data: {
    featured: []
  },

  onLoad() {
    // Show the 4 featured tutors on home page
    const featured = TUTORS.filter(t => t.featured).slice(0, 4);
    this.setData({ featured });
  },

  onScan() {
    // Use WeChat's built-in QR code scanner
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log('Scanned:', res.result);
        // Future: parse book ISBN, route to match page
        wx.showModal({
          title: '扫码成功',
          content: `识别到：${res.result}\n\n（演示版本，真实扫码将跳转到"匹配老师"页面）`,
          showCancel: false
        });
      },
      fail: () => {
        wx.showToast({ title: '扫码取消', icon: 'none' });
      }
    });
  },

  goTutors() {
    wx.switchTab({ url: '/pages/tutors/tutors' });
  },

  goTutor(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/tutor-detail/tutor-detail?id=${id}` });
  },

  // Share config
  onShareAppMessage() {
    return {
      title: '学伴 — 扫课本找云南本地好老师',
      path: '/pages/index/index'
    };
  }
});
