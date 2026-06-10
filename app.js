// app.js — global application logic
const store = require('./utils/store.js');

App({
  onLaunch() {
    console.log('学伴 Mini Program launched');

    // First-launch: seed a welcome conversation from the platform so the
    // messages tab is never empty on first open. tutorId 0 = 学伴官方.
    if (store.getConversations().length === 0) {
      store.appendMessage(0, 'tutor',
        '👋 欢迎来到学伴！扫描课本上的二维码，或在"找老师"里浏览，' +
        '找到合适的老师后即可在线沟通、预约免费试听。平台 0 抽成，学费 100% 归老师。');
    }

    // Reflect any unread messages on the 消息 tab badge from launch
    store.syncUnreadBadge();
  },

  globalData: {
    userInfo: null,
    currentCity: '昆明',
    currentDistrict: null
  }
});
