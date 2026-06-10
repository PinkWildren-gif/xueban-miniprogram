// pages/my/my.js
const { TUTORS, getTutorById, getFavorites } = require('../../utils/data.js');
const store = require('../../utils/store.js');

Page({
  data: {
    profile: { name: '', role: 'parent', city: '昆明', district: '五华区' },
    displayName: '点击设置昵称',
    avatarChar: '👤',
    roleLabel: '家长',
    favTutors: [],
    requests: [],
    hasApplication: false
  },

  onShow() {
    this.refreshAll();
  },

  refreshAll() {
    // Profile header
    const profile = store.getProfile();
    const hasName = profile.name && profile.name.length > 0;
    const displayName = hasName ? profile.name : '点击设置昵称';
    const avatarChar = hasName ? profile.name[0] : '👤';
    const roleLabel = profile.role === 'tutor' ? '老师' : '家长';

    // Favorites
    const favIds = getFavorites();
    const favTutors = TUTORS.filter(t => favIds.includes(t.id));

    // Trial lesson requests joined with tutor names
    const requests = store.getRequests().map(r => {
      const tutor = getTutorById(r.tutorId);
      return {
        id: r.id,
        tutorId: r.tutorId,
        tutorName: tutor ? tutor.name : '老师',
        date: r.date,
        time: r.time,
        mode: r.mode,
        note: r.note,
        status: r.status,
        statusLabel: r.status === 'pending' ? '待确认' : '已取消'
      };
    });

    // Tutor application strip
    const hasApplication = !!store.getTutorApplication();

    this.setData({
      profile,
      displayName,
      avatarChar,
      roleLabel,
      favTutors,
      requests,
      hasApplication
    });
  },

  // ---------- profile ----------
  onEditName() {
    wx.showModal({
      title: '设置昵称',
      editable: true,
      placeholderText: '输入昵称',
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          store.saveProfile({ name: res.content.trim() });
          this.refreshAll();
        }
      }
    });
  },

  // ---------- favorites ----------
  goTutor(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    wx.navigateTo({ url: `/pages/tutor-detail/tutor-detail?id=${id}` });
  },

  goTutors() {
    wx.switchTab({ url: '/pages/tutors/tutors' });
  },

  // ---------- trial requests ----------
  goRequestTutor(e) {
    const id = parseInt(e.currentTarget.dataset.tutorId);
    wx.navigateTo({ url: `/pages/tutor-detail/tutor-detail?id=${id}` });
  },

  onCancelRequest(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    wx.showModal({
      title: '取消预约',
      content: '确定取消这次试听预约吗？',
      confirmText: '确定取消',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          store.cancelRequest(id);
          wx.showToast({ title: '已取消', icon: 'none', duration: 800 });
          this.refreshAll();
        }
      }
    });
  },

  // ---------- tutor application ----------
  goTutorSignup() {
    wx.navigateTo({ url: '/pages/tutor-signup/tutor-signup' });
  },

  // ---------- account menu ----------
  onMyCourses() {
    wx.showToast({ title: '正式课功能开发中', icon: 'none' });
  },

  goMessages() {
    wx.switchTab({ url: '/pages/messages/messages' });
  },

  onMembership() {
    wx.showToast({ title: '会员功能开发中', icon: 'none' });
  },

  onInvite() {
    wx.showToast({ title: '点右上角 ··· 分享给好友', icon: 'none' });
  },

  // ---------- help menu ----------
  goCompliance() {
    wx.navigateTo({ url: '/pages/compliance/compliance' });
  },

  goTerms() {
    wx.navigateTo({ url: '/pages/terms/terms' });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  onContact() {
    wx.showModal({
      title: '联系客服',
      content: '微信客服：xueban-service（演示）\n工作时间：工作日 9:00-18:00',
      showCancel: false
    });
  },

  // ---------- share ----------
  onShareAppMessage() {
    return {
      title: '学伴 · 扫教材二维码，找懂这本书的本地老师',
      path: '/pages/index/index'
    };
  }
});
