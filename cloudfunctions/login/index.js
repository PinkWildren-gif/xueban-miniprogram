// cloudfunctions/login/index.js
// Returns the caller's identity (OPENID / APPID / UNIONID) from the WeChat
// context and upserts a user document in the 'users' collection.
//
// Call from the client:
//   wx.cloud.callFunction({ name: 'login' }).then(res => res.result.openid)
//
// Returns:
//   { ok: true, openid, appid, unionid, isNewUser, userSaved }
//   { ok: false, error }  — only when no OPENID is present (should not happen
//                           for real mini-program calls)

const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async () => {
  // getWXContext() is injected by the platform — no event input is needed,
  // and nothing here trusts client-supplied data.
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const appid = wxContext.APPID;
  const unionid = wxContext.UNIONID || null;

  if (!openid) {
    return { ok: false, error: 'NO_OPENID: not called from a mini program context' };
  }

  let isNewUser = false;
  let userSaved = true;

  try {
    const users = db.collection('users');
    const existing = await users.where({ openid }).limit(1).get();

    if (existing.data.length === 0) {
      // First visit: create the user document. Default role is 'parent';
      // it flips to 'tutor' when an application is approved (manual, admin-side).
      isNewUser = true;
      await users.add({
        data: {
          _openid: openid, // set explicitly so 仅创建者可读写 presets work client-side
          openid,
          role: 'parent',
          createdAt: db.serverDate(),
          lastLoginAt: db.serverDate()
        }
      });
    } else {
      await users.doc(existing.data[0]._id).update({
        data: { lastLoginAt: db.serverDate() }
      });
    }
  } catch (err) {
    // Do not block login on a DB hiccup (e.g. 'users' collection not created
    // yet) — the identity is still useful to the client. Surface the problem.
    userSaved = false;
    console.error('login: users upsert failed:', err);
  }

  return { ok: true, openid, appid, unionid, isNewUser, userSaved };
};
