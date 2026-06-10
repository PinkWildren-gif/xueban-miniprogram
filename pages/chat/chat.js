// pages/chat/chat.js — 1:1 conversation screen
const { getTutorById } = require('../../utils/data.js');
const store = require('../../utils/store.js');

// tutorId 0 = platform official account (not in TUTORS).
// Gradient kept identical to messages.js so the avatar doesn't change
// shade between the list and the conversation.
const OFFICIAL = {
  name: '学伴官方',
  color: 'linear-gradient(135deg,#1a5d3a,#14532d)'
};

// Canned auto-replies for real tutors, cycled by how many messages I have sent
const TUTOR_REPLIES = [
  '您好，看到您的消息啦！请问孩子目前是几年级，主要想提升哪部分呢？',
  '好的，我们可以先约一次30分钟免费试听，您看这周哪天方便？',
  '收到～我先了解一下孩子的情况，再给您一个针对性的学习计划。',
  '谢谢您的信任！上课时间和地点我们都可以灵活商量。'
];

const OFFICIAL_REPLY = '您好！这里是学伴官方。点击底部"找老师"即可浏览全部认证老师，预约免费试听～';

const TIME_GAP = 5 * 60 * 1000; // show a time divider when gap > 5 min

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

// Format a ms timestamp into a divider label (computed in JS, never in WXML)
function formatTimeLabel(ms) {
  const d = new Date(ms);
  const now = new Date();
  const hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
  if (d.toDateString() === now.toDateString()) return hm;
  const yesterday = new Date(now.getTime() - 86400000);
  if (d.toDateString() === yesterday.toDateString()) return '昨天 ' + hm;
  return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
}

Page({
  data: {
    tutorId: 0,
    tutor: null,        // null for official account
    isOfficial: false,
    chatName: '',
    avatarChar: '学',
    avatarColor: '',
    messages: [],       // [{id, from, text, showTime, timeLabel}]
    inputValue: '',
    canSend: false,     // true only when input has non-whitespace content
    scrollTarget: ''    // id of last message for scroll-into-view
  },

  onLoad(options) {
    let tutorId = parseInt(options.tutorId || 0);
    if (isNaN(tutorId)) tutorId = 0;
    const isOfficial = tutorId === 0;
    const tutor = isOfficial ? null : (getTutorById(tutorId) || null);

    // Unknown tutorId from a crafted deep link: bail out instead of
    // persisting a phantom conversation.
    if (!isOfficial && !tutor) {
      wx.showToast({ title: '老师不存在', icon: 'none' });
      setTimeout(() => {
        if (getCurrentPages().length > 1) wx.navigateBack();
        else wx.switchTab({ url: '/pages/index/index' });
      }, 800);
      return;
    }

    const name = isOfficial ? OFFICIAL.name : tutor.name;

    this._alive = true;
    this._replyTimer = null;

    this.setData({
      tutorId,
      tutor,
      isOfficial,
      chatName: name,
      avatarChar: name[0],
      avatarColor: isOfficial ? OFFICIAL.color : (tutor ? tutor.color : '#1a5d3a')
    });

    wx.setNavigationBarTitle({ title: name });

    store.ensureConversation(tutorId);
    store.markConversationRead(tutorId);
    store.syncUnreadBadge();
    this.renderMessages();
  },

  onUnload() {
    // Deliberately NOT clearing _replyTimer: the simulated reply must still
    // land in storage after the user leaves, so the messages tab shows an
    // unread badge — mirroring how a real tutor reply would arrive.
    this._alive = false;
  },

  // Re-read the conversation and precompute render fields for WXML
  renderMessages() {
    const conv = store.getConversation(this.data.tutorId);
    const msgs = (conv && conv.messages) || [];

    const rendered = msgs.map((m, i) => {
      const prev = i > 0 ? msgs[i - 1] : null;
      const showTime = !prev || (m.time - prev.time > TIME_GAP);
      return {
        id: 'msg-' + i,
        from: m.from,
        text: m.text,
        showTime,
        timeLabel: showTime ? formatTimeLabel(m.time) : ''
      };
    });

    // Set messages first, then the scroll target, so the node exists
    // when scroll-into-view fires.
    this.setData({ messages: rendered }, () => {
      if (rendered.length > 0) {
        this.setData({ scrollTarget: 'msg-' + (rendered.length - 1) });
      }
    });
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value,
      canSend: !!e.detail.value.trim()
    });
  },

  onSend() {
    const text = (this.data.inputValue || '').trim();
    if (!text) return;
    const tutorId = this.data.tutorId;

    store.appendMessage(tutorId, 'me', text);
    this.setData({ inputValue: '', canSend: false });
    this.renderMessages();

    // Simulated reply after 1.2s
    if (this._replyTimer) clearTimeout(this._replyTimer);
    this._replyTimer = setTimeout(() => {
      let reply;
      if (this.data.isOfficial) {
        reply = OFFICIAL_REPLY;
      } else {
        const conv = store.getConversation(tutorId);
        const myCount = ((conv && conv.messages) || [])
          .filter(m => m.from === 'me').length;
        reply = TUTOR_REPLIES[Math.max(0, myCount - 1) % TUTOR_REPLIES.length];
      }
      store.appendMessage(tutorId, 'tutor', reply);
      if (this._alive) {
        // This chat instance is still open: reply counts as read immediately
        store.markConversationRead(tutorId);
        this.renderMessages();
      } else {
        // User left before the reply landed. If they're now looking at the
        // same chat (re-entered) or the messages list, refresh it live so
        // the UI matches storage.
        const pages = getCurrentPages();
        const top = pages[pages.length - 1];
        if (top && top.route === 'pages/chat/chat' &&
            top.data.tutorId === tutorId && top.renderMessages) {
          store.markConversationRead(tutorId);
          top.renderMessages();
        } else if (top && top.route === 'pages/messages/messages' && top.loadConversations) {
          top.loadConversations();
        }
      }
      store.syncUnreadBadge();
    }, 1200);
  },

  goBooking() {
    wx.navigateTo({ url: '/pages/booking/booking?tutorId=' + this.data.tutorId });
  },

  goDetail() {
    wx.navigateTo({ url: '/pages/tutor-detail/tutor-detail?id=' + this.data.tutorId });
  }
});
