// pages/messages/messages.js — conversations list (tab page)
const { getTutorById } = require('../../utils/data.js');
const store = require('../../utils/store.js');

// tutorId 0 = platform account (not in TUTORS)
const OFFICIAL = {
  name: '学伴官方',
  school: '平台通知',
  color: 'linear-gradient(135deg,#1a5d3a,#14532d)'
};

const FALLBACK = {
  name: '未知老师',
  school: '',
  color: 'linear-gradient(135deg,#9CA3AF,#4B5563)',
  bare: true // name already complete — don't append ' 老师'
};

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

// today -> 'HH:MM' / this year -> 'M月D日' / else -> 'YYYY年M月D日'
function formatTimeLabel(ms) {
  const d = new Date(ms);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  if (d.getFullYear() === now.getFullYear()) {
    return (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function truncate(text, max) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

Page({
  data: {
    conversations: []
  },

  onShow() {
    this.loadConversations();
  },

  loadConversations() {
    const list = store.getConversations().map(conv => {
      const isOfficial = conv.tutorId === 0;
      const info = isOfficial
        ? OFFICIAL
        : (getTutorById(conv.tutorId) || FALLBACK);
      const last = conv.messages.length > 0
        ? conv.messages[conv.messages.length - 1]
        : null;
      const unread = conv.unread || 0;
      return {
        tutorId: conv.tutorId,
        displayName: (isOfficial || info.bare) ? info.name : info.name + ' 老师',
        avatarChar: info.name[0],
        color: info.color,
        lastMessage: last ? truncate(last.text, 30) : '暂无消息',
        timeLabel: formatTimeLabel(conv.lastTime),
        unread: unread,
        unreadLabel: unread > 99 ? '99+' : '' + unread
      };
    });
    this.setData({ conversations: list });
    store.syncUnreadBadge();
  },

  goChat(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    wx.navigateTo({ url: '/pages/chat/chat?tutorId=' + id });
  },

  goTutors() {
    wx.switchTab({ url: '/pages/tutors/tutors' });
  }
});
