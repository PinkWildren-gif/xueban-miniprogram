// pages/tutor-signup/tutor-signup.js — multi-step tutor application
const { SUBJECTS, GRADES, DISTRICTS, CATEGORIES, BOOKS } = require('../../utils/data.js');
const store = require('../../utils/store.js');

const MODES = ['上门', '线上', '线下机构'];

// Subjects available per teaching category — step 2 only shows chips for the active category
const CATEGORY_SUBJECTS = {
  '学科': ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理'],
  '艺术': ['钢琴', '书法', '美术', '舞蹈', '声乐'],
  '素质': ['编程', '体育']
};

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatDateTime(ms) {
  const d = new Date(ms);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

// Fresh form state (used on load and when restarting the application)
function initialFormData() {
  return {
    view: 'form', // 'form' | 'status' | 'success'
    step: 1,
    // step 1 基本信息
    name: '',
    gender: '',
    genderIdx: 0,
    age: '',
    school: '',
    district: '',
    districtIdx: 0,
    years: '',
    // step 2 教学信息
    category: '学科',
    subjects: CATEGORY_SUBJECTS['学科'],
    subjectsSel: {},
    gradesSel: {},
    price: '',
    modesSel: {},
    booksOpen: false,
    bookSearch: '',
    filteredBooks: BOOKS,
    bookSel: {},
    bookCount: 0,
    // step 3 资质上传
    images: { idcard: '', diploma: '', cert: '' },
    // step 4 平台承诺
    checks: [false, false, false, false],
    allChecked: false,
    // status view
    summaryRows: []
  };
}

Page({
  data: Object.assign({
    steps: ['基本信息', '教学信息', '资质上传', '平台承诺'],
    genders: ['男', '女'],
    districts: DISTRICTS,
    categories: CATEGORIES,
    grades: GRADES,
    modes: MODES,
    uploadSlots: [
      { key: 'idcard', label: '身份证', required: true, hint: '用于实名核验' },
      { key: 'diploma', label: '学历证书', required: true, hint: '用于学历核验' },
      { key: 'cert', label: '教师资格证', required: false, hint: '+15% 推荐权重' }
    ]
  }, initialFormData()),

  onLoad() {
    const app = store.getTutorApplication();
    if (app) this.showStatus(app);
  },

  // ---------- status screen (existing application) ----------
  showStatus(app) {
    const cat = CATEGORIES.find(c => c.key === app.category);
    const rows = [
      { label: '姓名', value: (app.name || '—') + (app.gender ? '（' + app.gender + '）' : '') },
      { label: '资质 / 院校', value: app.school || '—' },
      { label: '所在区域', value: app.district || '—' },
      { label: '教龄', value: (app.years || app.years === 0) ? app.years + ' 年' : '—' },
      { label: '教学类别', value: cat ? cat.icon + ' ' + cat.label : (app.category || '—') },
      { label: '教授科目', value: (app.subjects || []).join('、') || '—' },
      { label: '面向年级', value: (app.grades || []).join('、') || '—' },
      { label: '课时费', value: '¥' + (app.price || 0) + ' / 课时' },
      { label: '授课方式', value: (app.modes || []).join('、') || '—' }
    ];
    if ((app.books || []).length > 0) {
      rows.push({ label: '精通教材', value: app.books.length + ' 本' });
    }
    rows.push({ label: '提交时间', value: app.created ? formatDateTime(app.created) : '—' });
    this.setData({ view: 'status', summaryRows: rows });
  },

  restartApplication() {
    wx.showModal({
      title: '重新填写',
      content: '将清除当前申请记录并重新填写入驻信息，确定继续吗？',
      confirmText: '重新填写',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          store.clearTutorApplication();
          this.setData(initialFormData());
          wx.pageScrollTo({ scrollTop: 0, duration: 0 });
        }
      }
    });
  },

  // ---------- generic field input ----------
  onField(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },

  onGender(e) {
    const i = parseInt(e.detail.value);
    this.setData({ genderIdx: i, gender: this.data.genders[i] });
  },

  onDistrict(e) {
    const i = parseInt(e.detail.value);
    this.setData({ districtIdx: i, district: DISTRICTS[i] });
  },

  // ---------- step 2: chip toggles ----------
  setCategory(e) {
    const cat = e.currentTarget.dataset.val;
    const allowed = CATEGORY_SUBJECTS[cat] || [];
    // Drop already-selected subjects that don't belong to the new category
    const sel = {};
    allowed.forEach(s => {
      if (this.data.subjectsSel[s]) sel[s] = true;
    });
    const update = { category: cat, subjects: allowed, subjectsSel: sel };
    if (cat !== '学科') {
      // Leaving 学科 invalidates the textbook selection — reset it fully
      update.booksOpen = false;
      update.bookSearch = '';
      update.filteredBooks = BOOKS;
      update.bookSel = {};
      update.bookCount = 0;
    }
    this.setData(update);
  },

  toggleSubject(e) {
    const val = e.currentTarget.dataset.val;
    const sel = Object.assign({}, this.data.subjectsSel);
    sel[val] = !sel[val];
    this.setData({ subjectsSel: sel });
  },

  toggleGrade(e) {
    const val = e.currentTarget.dataset.val;
    const sel = Object.assign({}, this.data.gradesSel);
    sel[val] = !sel[val];
    this.setData({ gradesSel: sel });
  },

  toggleMode(e) {
    const val = e.currentTarget.dataset.val;
    const sel = Object.assign({}, this.data.modesSel);
    sel[val] = !sel[val];
    this.setData({ modesSel: sel });
  },

  // ---------- step 2: textbook multi-select ----------
  toggleBooksOpen() {
    this.setData({ booksOpen: !this.data.booksOpen });
  },

  onBookSearch(e) {
    const raw = e.detail.value;
    const terms = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = terms.length === 0
      ? BOOKS
      : BOOKS.filter(b => {
          const hay = (b.key + b.title + b.subject + b.grade + b.series).toLowerCase();
          return terms.every(t => hay.includes(t));
        });
    this.setData({ bookSearch: raw, filteredBooks: list });
  },

  toggleBook(e) {
    const key = e.currentTarget.dataset.key;
    const sel = Object.assign({}, this.data.bookSel);
    sel[key] = !sel[key];
    const count = BOOKS.filter(b => sel[b.key]).length;
    this.setData({ bookSel: sel, bookCount: count });
  },

  // ---------- step 3: upload slots (local preview only) ----------
  chooseImage(e) {
    const key = e.currentTarget.dataset.key;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const path = res.tempFiles[0].tempFilePath;
        const images = Object.assign({}, this.data.images);
        images[key] = path;
        this.setData({ images });
      }
    });
  },

  // ---------- step 4: compliance pledges ----------
  toggleCheck(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    const checks = this.data.checks.slice();
    checks[idx] = !checks[idx];
    this.setData({ checks, allChecked: checks.every(Boolean) });
  },

  goTerms() {
    wx.navigateTo({ url: '/pages/terms/terms' });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  // ---------- step navigation ----------
  warn(msg) {
    wx.showToast({ title: msg, icon: 'none' });
    return false;
  },

  validateStep(step) {
    const d = this.data;
    if (step === 1) {
      if (!d.name || !d.name.trim()) return this.warn('请填写姓名');
      if (!d.gender) return this.warn('请选择性别');
      const age = parseInt(d.age);
      if (!age || age < 18 || age > 80) return this.warn('请填写有效年龄（18-80）');
      if (!d.school || !d.school.trim()) return this.warn('请填写毕业院校 / 资质背景');
      if (!d.district) return this.warn('请选择所在区域');
      const years = parseInt(d.years);
      if (isNaN(years) || years < 0 || years > 60) return this.warn('请填写教龄');
    }
    if (step === 2) {
      if (SUBJECTS.filter(s => d.subjectsSel[s]).length === 0) return this.warn('请至少选择一个科目');
      if (GRADES.filter(g => d.gradesSel[g]).length === 0) return this.warn('请至少选择一个年级');
      const price = parseInt(d.price);
      if (!price || price <= 0) return this.warn('请填写课时费');
      if (MODES.filter(m => d.modesSel[m]).length === 0) return this.warn('请至少选择一种授课方式');
    }
    if (step === 3) {
      if (!d.images.idcard) return this.warn('请上传身份证照片');
      if (!d.images.diploma) return this.warn('请上传学历证书');
    }
    return true;
  },

  prevStep() {
    if (this.data.step > 1) {
      this.setData({ step: this.data.step - 1 });
      wx.pageScrollTo({ scrollTop: 0, duration: 200 });
    }
  },

  nextStep() {
    if (!this.validateStep(this.data.step)) return;
    if (this.data.step < 4) {
      this.setData({ step: this.data.step + 1 });
      wx.pageScrollTo({ scrollTop: 0, duration: 200 });
    }
  },

  // ---------- submit ----------
  submitApplication() {
    if (!this.data.allChecked) {
      this.warn('请先勾选全部承诺条款');
      return;
    }
    const d = this.data;
    store.saveTutorApplication({
      name: d.name.trim(),
      gender: d.gender,
      age: parseInt(d.age),
      school: d.school.trim(),
      district: d.district,
      years: parseInt(d.years),
      category: d.category,
      subjects: SUBJECTS.filter(s => d.subjectsSel[s]),
      grades: GRADES.filter(g => d.gradesSel[g]),
      price: parseInt(d.price),
      modes: MODES.filter(m => d.modesSel[m]),
      books: d.category === '学科' ? BOOKS.filter(b => d.bookSel[b.key]).map(b => b.key) : [],
      images: {
        idcard: d.images.idcard,
        diploma: d.images.diploma,
        cert: d.images.cert
      }
    });
    this.setData({ view: 'success' });
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
