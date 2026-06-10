// pages/index/index.js
const { TUTORS, BOOKS } = require('../../utils/data.js');
const store = require('../../utils/store.js');

Page({
  data: {
    featured: [],
    showCompliance: false
  },

  onLoad() {
    // Show the 4 featured tutors on home page
    const featured = TUTORS.filter(t => t.featured).slice(0, 4);
    this.setData({
      featured,
      // Stats are derived from data so they stay in sync with the catalog
      tutorCount: TUTORS.length,
      bookCount: BOOKS.length,
      // Gate first-time users with the compliance notice
      showCompliance: !store.hasAcknowledgedCompliance()
    });
  },

  onComplianceAgree() {
    store.acknowledgeCompliance();
    this.setData({ showCompliance: false });
  },

  onScan() {
    // Use WeChat's built-in QR code scanner
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log('Scanned:', res.result);
        // Demo: route every scan to the match page with a sample book key.
        // Production will parse the QR payload (ISBN / book code) into a real book key.
        wx.navigateTo({
          url: '/pages/match/match?book=' + encodeURIComponent('人教·数学·五上') +
               '&raw=' + encodeURIComponent(res.result)
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

  goBooks() {
    wx.navigateTo({ url: '/pages/books/books' });
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
