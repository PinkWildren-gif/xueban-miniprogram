// pages/books/books.js
const { BOOKS } = require('../../utils/data.js');

// Fixed display order for grade sections
const GRADE_ORDER = ['小学', '初中', '高中'];

Page({
  data: {
    totalBooks: BOOKS.length,
    searchText: '',
    sections: [], // [{ grade, count, books: [] }]
    total: 0      // total matched books across all sections
  },

  onLoad() {
    this.applySearch('');
  },

  onSearchInput(e) {
    this.applySearch(e.detail.value);
  },

  clearSearch() {
    this.applySearch('');
  },

  // Filter by title / subject / series / level, then re-group by grade
  applySearch(text) {
    const q = (text || '').trim().toLowerCase();

    const list = q
      ? BOOKS.filter(b =>
          b.title.toLowerCase().includes(q) ||
          b.subject.toLowerCase().includes(q) ||
          b.series.toLowerCase().includes(q) ||
          b.level.toLowerCase().includes(q)
        )
      : BOOKS.slice();

    const sections = GRADE_ORDER
      .map(grade => {
        const books = list
          .filter(b => b.grade === grade)
          .sort((a, b) => b.tutorCount - a.tutorCount);
        return { grade, count: books.length, books };
      })
      .filter(s => s.count > 0);

    // Single setData per keystroke: searchText + regrouped sections together
    this.setData({ searchText: text || '', sections, total: list.length });
  },

  goMatch(e) {
    const key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/match/match?book=' + encodeURIComponent(key)
    });
  }
});
