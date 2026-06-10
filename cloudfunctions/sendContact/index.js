// cloudfunctions/sendContact/index.js
// Stores a parent → tutor contact request in the 'contacts' collection.
// This is the wizard-of-oz inbox: an admin reads new rows in the 云开发
// console and relays them to the tutor by hand. No push, no chat relay —
// just a durable record of who wants to reach whom.
//
// event:
//   {
//     tutorId: number   (required, > 0 — matches the numeric 'id' in 'tutors';
//                        0 is reserved for the 学伴官方 platform account)
//     message: string   (required, 1-500 chars)
//   }
//
// Returns: { ok: true, id }
//          { ok: false, error, field? }

const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const e = event && typeof event === 'object' ? event : {};
  const { OPENID: openid } = cloud.getWXContext();

  if (!openid) {
    return { ok: false, error: 'NO_OPENID: not called from a mini program context' };
  }

  // ---- validate input -----------------------------------------------------
  const tutorId = parseInt(e.tutorId, 10);
  if (!Number.isFinite(tutorId) || tutorId <= 0) {
    return { ok: false, field: 'tutorId', error: '无效的老师编号' };
  }

  const message = typeof e.message === 'string' ? e.message.trim() : '';
  if (!message) {
    return { ok: false, field: 'message', error: '请输入留言内容' };
  }
  if (message.length > 500) {
    return { ok: false, field: 'message', error: '留言内容请控制在 500 字以内' };
  }

  // ---- write --------------------------------------------------------------
  try {
    const addRes = await db.collection('contacts').add({
      data: {
        _openid: openid, // explicit so 仅创建者可读写 lets the sender read their own requests
        fromOpenid: openid,
        tutorId,
        message,
        status: 'new', // admin flips to 'relayed' / 'closed' in the console
        createdAt: db.serverDate()
      }
    });

    return { ok: true, id: addRes._id };
  } catch (err) {
    console.error('sendContact failed:', err);
    return { ok: false, error: err.message };
  }
};
