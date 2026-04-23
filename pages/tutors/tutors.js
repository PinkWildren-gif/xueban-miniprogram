// pages/tutors/tutors.js
const { TUTORS, GRADES, DISTRICTS, toggleFavorite, isFavorited } = require('../../utils/data.js');

const SORT_OPTIONS = ['⭐ 好评优先', '💰 价格低→高', '💰 价格高→低', '📅 教龄优先'];

Page({
  data: {
    grades: GRADES,
    districts: DISTRICTS,
    activeCat: 'all',
    activeGrade: 'all',
    activeDistrict: 'all',
    searchText: '',
    sortOptions: SORT_OPTIONS,
    sortIdx: 0,
    filtered: []
  },

  onLoad() {
    this.applyFilters();
  },

  onShow() {
    // Re-render to reflect favorite changes from detail page
    this.applyFilters();
  },

  setCategory(e) {
    this.setData({ activeCat: e.currentTarget.dataset.val }, () => this.applyFilters());
  },
  setGrade(e) {
    this.setData({ activeGrade: e.currentTarget.dataset.val }, () => this.applyFilters());
  },
  setDistrict(e) {
    this.setData({ activeDistrict: e.currentTarget.dataset.val }, () => this.applyFilters());
  },
  setSort(e) {
    this.setData({ sortIdx: parseInt(e.detail.value) }, () => this.applyFilters());
  },
  onSearchInput(e) {
    this.setData({ searchText: e.detail.value }, () => this.applyFilters());
  },

  resetFilters() {
    this.setData({
      activeCat: 'all',
      activeGrade: 'all',
      activeDistrict: 'all',
      searchText: '',
      sortIdx: 0
    }, () => this.applyFilters());
  },

  applyFilters() {
    const { activeCat, activeGrade, activeDistrict, searchText, sortIdx } = this.data;
    const q = searchText.toLowerCase();

    let list = TUTORS.filter(t => {
      if (activeCat !== 'all' && t.category !== activeCat) return false;
      if (activeGrade !== 'all' && !t.grades.includes(activeGrade)) return false;
      if (activeDistrict !== 'all' && t.district !== activeDistrict) return false;
      if (q) {
        const hit =
          t.name.toLowerCase().includes(q) ||
          t.school.toLowerCase().includes(q) ||
          t.subjects.some(s => s.toLowerCase().includes(q)) ||
          t.tags.some(tg => tg.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });

    // Sort
    switch (sortIdx) {
      case 0: list.sort((a, b) => b.rating - a.rating); break;
      case 1: list.sort((a, b) => a.price - b.price); break;
      case 2: list.sort((a, b) => b.price - a.price); break;
      case 3: list.sort((a, b) => b.years - a.years); break;
    }

    // Annotate with favorite state
    list = list.map(t => ({ ...t, isFav: isFavorited(t.id) }));

    this.setData({ filtered: list });
  },

  onToggleFav(e) {
    const id = e.currentTarget.dataset.id;
    const nowFav = toggleFavorite(id);
    wx.showToast({ title: nowFav ? '已收藏' : '取消收藏', icon: 'none', duration: 800 });
    this.applyFilters();
  },

  goTutor(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/tutor-detail/tutor-detail?id=${id}` });
  }
});
