// pages/tutor-detail/tutor-detail.js
const { getTutorById, getReviewsForTutor, toggleFavorite, isFavorited } = require('../../utils/data.js');

// Build star string in JS (no method calls allowed in WXML bindings)
function buildStars(rating) {
  let s = '';
  for (let i = 0; i < rating; i++) s += '★';
  return s;
}

// Category-aware "double reduction" compliance copy
function buildComplianceText(tutor) {
  if (tutor.category === '学科') {
    const compulsory = tutor.grades.includes('小学') || tutor.grades.includes('初中');
    if (compulsory) {
      return '针对义务教育阶段（小学 1 至初中 3 年级）学生的学科类辅导，不得在节假日、周末、寒暑假期间进行。';
    }
    return '高中阶段学科辅导不受双减周末时段限制，但请遵守当地教育部门规定。';
  }
  return '本课程属素质类培训，不受双减学科类时段限制。';
}

Page({
  data: {
    tutor: null,
    isFav: false,
    complianceText: '',
    reviewCount: 0,
    reviewsFull: [],
    reviewsPreview: [],
    showAllReviews: false,
    lastReviewIndex: -1
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

    // Precompute review display values (stars/date as plain strings)
    const reviewsFull = getReviewsForTutor(id).map((r, idx) => ({
      idx,
      parent: r.parent,
      date: r.date,
      text: r.text,
      stars: buildStars(r.rating)
    }));
    const reviewsPreview = reviewsFull.slice(0, 3);

    wx.setNavigationBarTitle({ title: `${tutor.name} 老师` });

    this.setData({
      tutor: display,
      isFav: isFavorited(id),
      complianceText: buildComplianceText(tutor),
      reviewCount: reviewsFull.length,
      reviewsFull,
      reviewsPreview,
      showAllReviews: false,
      lastReviewIndex: reviewsPreview.length - 1
    });
  },

  toggleReviews() {
    const showAll = !this.data.showAllReviews;
    const visible = showAll ? this.data.reviewsFull : this.data.reviewsPreview;
    this.setData({
      showAllReviews: showAll,
      lastReviewIndex: visible.length - 1
    });
  },

  goBook(e) {
    const key = e.currentTarget.dataset.key;
    wx.navigateTo({ url: `/pages/match/match?book=${encodeURIComponent(key)}` });
  },

  onBookTrial() {
    wx.navigateTo({ url: `/pages/booking/booking?tutorId=${this.data.tutor.id}` });
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
    wx.navigateTo({ url: `/pages/chat/chat?tutorId=${this.data.tutor.id}` });
  },

  onShareAppMessage() {
    const t = this.data.tutor;
    // Guard: tutor may still be null (invalid id path before navigateBack fires)
    if (!t) {
      return {
        title: '学伴 · 扫课本找好老师',
        path: '/pages/index/index'
      };
    }
    return {
      title: `${t.name} 老师 · ${t.school}`,
      path: `/pages/tutor-detail/tutor-detail?id=${t.id}`
    };
  }
});
