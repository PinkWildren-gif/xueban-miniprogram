// pages/booking/booking.js — trial-lesson request form with 双减 compliance logic
const { getTutorById } = require('../../utils/data.js');
const store = require('../../utils/store.js');

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// K9 academic tutoring must end by 20:30 → 60-min lessons start no later than 19:30
const K9_SLOTS = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
const FREE_SLOTS = ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

// PRC statutory holidays (双减 bans K9 academic tutoring on these too).
// Demo-grade table for the 2026 window; production should load this from
// server config updated against the annual 国务院放假安排.
const HOLIDAYS = new Set([
  '2026-01-01', '2026-01-02', '2026-01-03',
  '2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22',
  '2026-04-04', '2026-04-05', '2026-04-06',
  '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
  '2026-06-19', '2026-06-20', '2026-06-21',
  '2026-09-25', '2026-09-26', '2026-09-27',
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07',
  '2027-01-01', '2027-01-02', '2027-01-03'
]);

// School vacation windows (寒暑假) — 双减 bans K9 academic tutoring during
// these as well. Approximate Yunnan school calendar; production loads the
// real dates from server config each term.
const VACATIONS = [
  ['2026-07-04', '2026-08-31'], // 2026 暑假
  ['2027-01-23', '2027-02-28']  // 2027 寒假
];

function inVacation(dateKey) {
  return VACATIONS.some(([start, end]) => dateKey >= start && dateKey <= end);
}

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

Page({
  data: {
    tutor: null,
    isK9Academic: false,
    days: [],            // [{label:'6月11日', weekday:'周四', disabled}]
    selectedDateIdx: -1,
    timeSlots: [],
    selectedTime: '',
    modes: [],
    selectedMode: '',
    note: '',
    noteLen: 0,
    canSubmit: false,
    submitted: false,
    submittedSummary: ''
  },

  onLoad(options) {
    const tutor = getTutorById(parseInt(options.tutorId));
    if (!tutor) {
      wx.showToast({ title: '未找到该老师', icon: 'none' });
      // If booking is the entry page (bad deep link), there is nothing to
      // go back to — fall back to the home tab instead of a blank screen.
      setTimeout(() => {
        if (getCurrentPages().length > 1) wx.navigateBack();
        else wx.switchTab({ url: '/pages/index/index' });
      }, 1200);
      return;
    }

    // Double-Reduction (双减): compulsory-education academic tutoring is restricted
    const isK9Academic =
      tutor.category === '学科' &&
      (tutor.grades.includes('小学') || tutor.grades.includes('初中'));

    const days = this.buildDays(isK9Academic);
    const firstEnabled = days.findIndex(d => !d.disabled);

    wx.setNavigationBarTitle({ title: `预约 ${tutor.name} 老师` });

    this.setData({
      tutor,
      isK9Academic,
      days,
      selectedDateIdx: firstEnabled,
      timeSlots: this.computeSlots(isK9Academic, firstEnabled),
      slotEmptyHint: firstEnabled < 0
        ? '近期均为双减限制时段，暂无可预约日期'
        : '今日时段已过，请选择其他日期',
      modes: tutor.mode
    });
  },

  // Next 14 days from today; weekends + statutory holidays disabled for K9 academic tutors
  buildDays(isK9Academic) {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const dow = d.getDay();
      const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      const isWeekend = dow === 0 || dow === 6;
      const isHoliday = HOLIDAYS.has(key);
      const isVacation = inVacation(key);
      days.push({
        label: `${d.getMonth() + 1}月${d.getDate()}日`,
        weekday: WEEKDAYS[dow],
        disabled: isK9Academic && (isWeekend || isHoliday || isVacation),
        banLabel: isHoliday ? '法定节假日' : (isVacation ? '寒暑假' : '双减停课')
      });
    }
    return days;
  },

  // dayIdx 0 = today: drop slots that have already passed.
  // dayIdx -1 = no selectable date at all (e.g. mid-vacation): no slots.
  computeSlots(isK9Academic, dayIdx) {
    if (dayIdx < 0) return [];
    const slots = isK9Academic ? K9_SLOTS : FREE_SLOTS;
    if (dayIdx !== 0) return slots;
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    return slots.filter(s => {
      const [h, m] = s.split(':');
      return parseInt(h) * 60 + parseInt(m) > nowMins;
    });
  },

  selectDate(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    const day = this.data.days[idx];
    if (day.disabled) {
      const reason = day.banLabel === '法定节假日' ? '法定节假日'
        : day.banLabel === '寒暑假' ? '寒暑假期间'
        : '周末';
      wx.showToast({
        title: `双减政策：${reason}不可预约学科辅导`,
        icon: 'none'
      });
      return;
    }
    // Recompute slots and clear chosen time when the date changes
    this.setData({
      selectedDateIdx: idx,
      timeSlots: this.computeSlots(this.data.isK9Academic, idx),
      slotEmptyHint: '今日时段已过，请选择其他日期',
      selectedTime: ''
    }, () => this.updateCanSubmit());
  },

  selectTime(e) {
    this.setData({ selectedTime: e.currentTarget.dataset.time }, () => this.updateCanSubmit());
  },

  selectMode(e) {
    this.setData({ selectedMode: e.currentTarget.dataset.mode }, () => this.updateCanSubmit());
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value, noteLen: e.detail.value.length });
  },

  updateCanSubmit() {
    const { selectedDateIdx, selectedTime, selectedMode } = this.data;
    this.setData({
      canSubmit: selectedDateIdx >= 0 && !!selectedTime && !!selectedMode
    });
  },

  submit() {
    const { canSubmit, tutor, days, selectedDateIdx, selectedTime, selectedMode, note } = this.data;
    if (!canSubmit) {
      wx.showToast({ title: '请先选择日期、时间和上课方式', icon: 'none' });
      return;
    }
    const day = days[selectedDateIdx];
    const dateLabel = `${day.label} ${day.weekday}`;
    store.addRequest({
      tutorId: tutor.id,
      date: dateLabel,
      time: selectedTime,
      mode: selectedMode,
      note
    });
    this.setData({
      submitted: true,
      submittedSummary: `${dateLabel} ${selectedTime} · ${selectedMode}`
    });
    wx.setNavigationBarTitle({ title: '申请已发送' });
  },

  // redirectTo so back won't return to the spent form
  goChat() {
    wx.redirectTo({ url: `/pages/chat/chat?tutorId=${this.data.tutor.id}` });
  },

  goMy() {
    wx.switchTab({ url: '/pages/my/my' });
  }
});
