// pages/match/match.js — "scanned a textbook" match results page
const { TUTORS, getBookByKey } = require('../../utils/data.js');
const { getProfile } = require('../../utils/store.js');

const DEFAULT_BOOK = '人教·数学·五上';
const SORT_OPTIONS = ['综合推荐', '距离最近', '好评最高', '价格低→高', '价格高→低'];

// Fake distance map (km) — replaced by real geolocation in production
const DISTANCES = {
  '西山区': 1.2,
  '五华区': 2.8,
  '盘龙区': 3.5,
  '官渡区': 4.1,
  '呈贡区': 5.6
};

Page({
  data: {
    bookKey: '',
    bookTitle: '',
    bookColor: 'linear-gradient(135deg,#F59E0B,#B45309)',
    coverSeries: '',
    coverLine1: '',
    coverLine2: '',
    scanTime: '',
    locationText: '',
    sortOptions: SORT_OPTIONS,
    sortIdx: 0,
    matches: [],
    bestId: 0    // tutor with the highest match % — stays stable across re-sorts
  },

  onLoad(options) {
    // options.raw would carry the raw QR payload — ignored for now,
    // the demo always resolves via the book key.
    const key = decodeURIComponent(options.book || DEFAULT_BOOK);

    const profile = getProfile();
    const now = new Date();
    const hh = ('0' + now.getHours()).slice(-2);
    const mm = ('0' + now.getMinutes()).slice(-2);

    this.setData({
      scanTime: hh + ':' + mm,
      locationText: '📍 ' + (profile.city || '昆明') + ' ' + (profile.district || '五华区')
    });

    this.runMatch(key);
  },

  // Build the match list for a book key and re-render
  runMatch(key) {
    // Key shape: '<series>·<subject>·<level>' — proceed even if unknown to BOOKS
    const parts = key.split('·');
    const series = parts[0] || '';
    const subject = parts[1] || '';
    const level = parts[2] || '';
    const prefix = series + '·' + subject;

    const book = getBookByKey(key);
    const bookTitle = book ? book.title : (series + '版 · ' + subject + ' · ' + level);
    const bookColor = book ? book.color : 'linear-gradient(135deg,#F59E0B,#B45309)';
    const coverLine1 = (book ? book.grade : '') + subject;

    // Candidates: anyone who has taught a book of the same series + subject
    const matches = TUTORS
      .filter(t => t.books && t.books.some(b => b.indexOf(prefix) === 0))
      .map(t => {
        const exact = t.books.indexOf(key) !== -1;

        // Match %: base 60, +30 exact book / +20 series+subject,
        // +5 一级教师, +5 特级教师, +3 rating >= 4.9, capped at 98
        let match = 60;
        match += exact ? 30 : 20;
        if (t.verified.indexOf('一级教师') !== -1) match += 5;
        if (t.verified.indexOf('特级教师') !== -1) match += 5;
        if (t.rating >= 4.9) match += 3;
        if (match > 98) match = 98;

        const dist = DISTANCES[t.district] || 5.0;

        const bookExp = exact
          ? '教授 ' + key + ' ' + Math.min(t.years, 8) + ' 年'
          : '教过' + series + '版' + subject + ' ' + Math.min(t.years, 10) + '+ 年';

        return {
          id: t.id,
          name: t.name,
          school: t.school,
          color: t.color,
          price: t.price,
          rating: t.rating,
          reviews: t.reviews,
          years: t.years,
          match: match,
          dist: dist,
          distText: dist.toFixed(1),
          bookExp: bookExp,
          highlight: t.bio.split('。')[0] + '。',
          tagList: t.tags.map(tag => ({
            text: tag,
            gift: tag.indexOf('🎁') !== -1
          }))
        };
      });

    this.allMatches = matches;
    const best = matches.reduce((a, b) => (b.match > (a ? a.match : -1) ? b : a), null);
    this.setData({
      bookKey: key,
      bookTitle: bookTitle,
      bookColor: bookColor,
      coverSeries: series ? series + '版' : '',
      coverLine1: coverLine1 || subject,
      coverLine2: level,
      bestId: best ? best.id : 0
    });
    this.applySort();
  },

  applySort() {
    const list = (this.allMatches || []).slice();
    switch (this.data.sortIdx) {
      case 0: list.sort((a, b) => b.match - a.match); break;
      case 1: list.sort((a, b) => a.dist - b.dist); break;
      case 2: list.sort((a, b) => b.rating - a.rating); break;
      case 3: list.sort((a, b) => a.price - b.price); break;
      case 4: list.sort((a, b) => b.price - a.price); break;
    }
    this.setData({ matches: list });
  },

  setSort(e) {
    this.setData({ sortIdx: parseInt(e.detail.value) }, () => this.applySort());
  },

  rescan() {
    wx.scanCode({
      success: (res) => {
        // In production we would parse res.result (the QR payload printed in
        // the textbook) into a book key. Demo QR codes aren't real, so we
        // simply re-run matching with the default book.
        wx.showToast({ title: '已重新识别', icon: 'success', duration: 800 });
        const now = new Date();
        this.setData({
          scanTime: ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2)
        });
        // Keep the book the user was already viewing — production would
        // parse res.result into a real book key here.
        this.runMatch(this.data.bookKey || DEFAULT_BOOK);
      },
      fail: () => {
        // User cancelled the scan — keep current results
      }
    });
  },

  goDetail(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    wx.navigateTo({ url: '/pages/tutor-detail/tutor-detail?id=' + id });
  },

  goChat(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    wx.navigateTo({ url: '/pages/chat/chat?tutorId=' + id });
  },

  goTutors() {
    wx.switchTab({ url: '/pages/tutors/tutors' });
  }
});
