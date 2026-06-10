// utils/store.js — local persistence layer (wx storage backed)
// All user state lives here so pages never touch wx.setStorageSync directly.
// When CloudBase is connected, these functions become the sync points
// (see CLOUDBASE-SETUP.md) — page code does not change.

const KEYS = {
  FAVORITES: 'favorites',
  COMPLIANCE_ACK: 'compliance_ack',
  PROFILE: 'profile',
  CONVERSATIONS: 'conversations',
  REQUESTS: 'lesson_requests',
  TUTOR_APP: 'tutor_application'
};

function get(key, fallback) {
  const v = wx.getStorageSync(key);
  return (v === '' || v === null || v === undefined) ? fallback : v;
}

function set(key, val) {
  wx.setStorageSync(key, val);
  return val;
}

// ---------- favorites ----------
// ids normalized to numbers here so callers can pass dataset strings safely
function getFavorites() {
  return get(KEYS.FAVORITES, []);
}

function toggleFavorite(id) {
  id = parseInt(id);
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  set(KEYS.FAVORITES, favs);
  return favs.includes(id);
}

function isFavorited(id) {
  return getFavorites().includes(parseInt(id));
}

// ---------- compliance acknowledgment (Double Reduction modal) ----------
function hasAcknowledgedCompliance() {
  return !!get(KEYS.COMPLIANCE_ACK, false);
}

function acknowledgeCompliance() {
  set(KEYS.COMPLIANCE_ACK, Date.now());
}

// ---------- user profile ----------
function getProfile() {
  return get(KEYS.PROFILE, {
    name: '',
    role: 'parent', // 'parent' | 'tutor'
    city: '昆明',
    district: '五华区'
  });
}

function saveProfile(patch) {
  const p = Object.assign(getProfile(), patch);
  return set(KEYS.PROFILE, p);
}

// ---------- conversations ----------
// shape: { tutorId, messages: [{from:'me'|'tutor', text, time}], lastTime, unread }
function getConversations() {
  const list = get(KEYS.CONVERSATIONS, []);
  return list.sort((a, b) => b.lastTime - a.lastTime);
}

function getConversation(tutorId) {
  tutorId = parseInt(tutorId);
  return get(KEYS.CONVERSATIONS, []).find(c => c.tutorId === tutorId) || null;
}

function ensureConversation(tutorId) {
  tutorId = parseInt(tutorId);
  const list = get(KEYS.CONVERSATIONS, []);
  let conv = list.find(c => c.tutorId === tutorId);
  if (!conv) {
    conv = { tutorId, messages: [], lastTime: Date.now(), unread: 0 };
    list.push(conv);
    set(KEYS.CONVERSATIONS, list);
  }
  return conv;
}

function appendMessage(tutorId, from, text) {
  tutorId = parseInt(tutorId);
  const list = get(KEYS.CONVERSATIONS, []);
  let conv = list.find(c => c.tutorId === tutorId);
  if (!conv) {
    conv = { tutorId, messages: [], lastTime: Date.now(), unread: 0 };
    list.push(conv);
  }
  conv.messages.push({ from, text, time: Date.now() });
  conv.lastTime = Date.now();
  if (from === 'tutor') conv.unread = (conv.unread || 0) + 1;
  set(KEYS.CONVERSATIONS, list);
  return conv;
}

function markConversationRead(tutorId) {
  tutorId = parseInt(tutorId);
  const list = get(KEYS.CONVERSATIONS, []);
  const conv = list.find(c => c.tutorId === tutorId);
  if (conv) {
    conv.unread = 0;
    set(KEYS.CONVERSATIONS, list);
  }
}

function getUnreadTotal() {
  return get(KEYS.CONVERSATIONS, []).reduce((n, c) => n + (c.unread || 0), 0);
}

// Mirror the unread total onto the 消息 tab badge (tab index 2).
// fail is a no-op: the call errors harmlessly if the tab bar isn't ready yet.
function syncUnreadBadge() {
  const n = getUnreadTotal();
  if (n > 0) {
    wx.setTabBarBadge({ index: 2, text: n > 99 ? '99+' : String(n), fail: () => {} });
  } else {
    wx.removeTabBarBadge({ index: 2, fail: () => {} });
  }
}

// ---------- lesson requests (trial bookings) ----------
// shape: { id, tutorId, date, time, mode, note, status:'pending'|'cancelled', created }
function getRequests() {
  return get(KEYS.REQUESTS, []).sort((a, b) => b.created - a.created);
}

function addRequest(req) {
  const list = get(KEYS.REQUESTS, []);
  const full = Object.assign({
    id: Date.now(),
    status: 'pending',
    created: Date.now()
  }, req);
  list.push(full);
  set(KEYS.REQUESTS, list);
  return full;
}

function cancelRequest(id) {
  const list = get(KEYS.REQUESTS, []);
  const req = list.find(r => r.id === id);
  if (req) {
    req.status = 'cancelled';
    set(KEYS.REQUESTS, list);
  }
}

// ---------- tutor application ----------
function getTutorApplication() {
  return get(KEYS.TUTOR_APP, null);
}

function saveTutorApplication(app) {
  return set(KEYS.TUTOR_APP, Object.assign({
    status: 'pending', // pending -> approved (manual review in real version)
    created: Date.now()
  }, app));
}

function clearTutorApplication() {
  wx.removeStorageSync(KEYS.TUTOR_APP);
}

module.exports = {
  KEYS,
  get,
  set,
  getFavorites,
  toggleFavorite,
  isFavorited,
  hasAcknowledgedCompliance,
  acknowledgeCompliance,
  getProfile,
  saveProfile,
  getConversations,
  getConversation,
  ensureConversation,
  appendMessage,
  markConversationRead,
  getUnreadTotal,
  syncUnreadBadge,
  getRequests,
  addRequest,
  cancelRequest,
  getTutorApplication,
  saveTutorApplication,
  clearTutorApplication
};
