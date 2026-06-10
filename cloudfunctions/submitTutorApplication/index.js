// cloudfunctions/submitTutorApplication/index.js
// Receives a tutor application from pages/tutor-signup and stores it in the
// 'applications' collection with status 'pending'. An admin reviews it in the
// 云开发 console (wizard-of-oz flow) and flips status / creates the tutor doc
// manually.
//
// event (payload contract — mirrors store.saveTutorApplication on the client):
//   {
//     name:     string  (required, 2-20 chars)
//     phone:    string  (required, mainland mobile, 1xxxxxxxxxx)
//     subjects: string | string[]  (required, at least one, e.g. ['数学'])
//     grades:   string | string[]  (required, subset of 小学/初中/高中)
//     district: string  (optional, one of the 5 Kunming districts)
//     school:   string  (optional, ≤ 50 chars)   — e.g. '云南师范大学 · 数学教育'
//     title:    string  (optional, ≤ 30 chars)   — e.g. '在职一级教师'
//     years:    number  (optional, 0-60)
//     price:    number  (optional, 0-2000, ¥/hour)
//     books:    string[] (optional)              — textbook keys like '人教·数学·五上'
//     mode:     string[] (optional)              — subset of 上门/线上/线下机构/户外
//     bio:      string  (optional, ≤ 500 chars)
//   }
//
// Returns: { ok: true, id }
//          { ok: false, error, field? }   — validation / duplicate errors

const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

const GRADES = ['小学', '初中', '高中'];
const DISTRICTS = ['五华区', '盘龙区', '官渡区', '西山区', '呈贡区'];
const MODES = ['上门', '线上', '线下机构', '户外'];

// Accept a string or an array of strings; return a trimmed, de-duplicated array.
function toStringArray(v) {
  const arr = Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : [];
  return [...new Set(arr.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim()))];
}

function fail(field, error) {
  return { ok: false, field, error };
}

exports.main = async (event) => {
  const e = event && typeof event === 'object' ? event : {};
  const { OPENID: openid } = cloud.getWXContext();

  if (!openid) {
    return { ok: false, error: 'NO_OPENID: not called from a mini program context' };
  }

  // ---- validate required fields ------------------------------------------
  const name = typeof e.name === 'string' ? e.name.trim() : '';
  if (name.length < 2 || name.length > 20) {
    return fail('name', '请填写真实姓名（2-20 个字符）');
  }

  const phone = typeof e.phone === 'string' ? e.phone.trim() : '';
  if (!/^1\d{10}$/.test(phone)) {
    return fail('phone', '请填写正确的 11 位手机号');
  }

  const subjects = toStringArray(e.subjects).slice(0, 5);
  if (subjects.length === 0) {
    return fail('subjects', '请至少选择一门可教科目');
  }

  const grades = toStringArray(e.grades).filter((g) => GRADES.includes(g));
  if (grades.length === 0) {
    return fail('grades', '请至少选择一个可教学段（小学/初中/高中）');
  }

  // ---- sanitize optional fields -------------------------------------------
  const district =
    typeof e.district === 'string' && DISTRICTS.includes(e.district.trim())
      ? e.district.trim()
      : '';
  const school = typeof e.school === 'string' ? e.school.trim().slice(0, 50) : '';
  const title = typeof e.title === 'string' ? e.title.trim().slice(0, 30) : '';
  const bio = typeof e.bio === 'string' ? e.bio.trim().slice(0, 500) : '';
  const books = toStringArray(e.books).slice(0, 20);
  const mode = toStringArray(e.mode).filter((m) => MODES.includes(m));

  let years = parseInt(e.years, 10);
  if (!Number.isFinite(years) || years < 0 || years > 60) years = 0;
  let price = parseInt(e.price, 10);
  if (!Number.isFinite(price) || price < 0 || price > 2000) price = 0;

  try {
    const applications = db.collection('applications');

    // ---- reject a second pending application from the same user ----------
    const dup = await applications
      .where({ openid, status: 'pending' })
      .count();
    if (dup.total > 0) {
      return {
        ok: false,
        error: 'DUPLICATE_PENDING',
        message: '您已有一份待审核的入驻申请，请耐心等待审核结果。'
      };
    }

    // ---- write ------------------------------------------------------------
    const addRes = await applications.add({
      data: {
        _openid: openid, // explicit so 仅创建者可读写 lets the applicant read their own doc
        openid,
        name,
        phone,
        subjects,
        grades,
        district,
        school,
        title,
        years,
        price,
        books,
        mode,
        bio,
        status: 'pending',
        createdAt: db.serverDate()
      }
    });

    // ---- post-write recheck: count-then-add above is a read/write race ----
    // (a double-tap can pass both counts). If multiple pending docs exist,
    // keep a DETERMINISTIC survivor (oldest createdAt, _id tie-break) so two
    // concurrent calls can never both delete their own doc and leave zero.
    const recheck = await applications
      .where({ openid, status: 'pending' })
      .count();
    if (recheck.total > 1) {
      const pending = await applications
        .where({ openid, status: 'pending' })
        .orderBy('createdAt', 'asc')
        .get();
      const docs = (pending.data || []).slice().sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (ta !== tb) return ta - tb;
        return a._id < b._id ? -1 : 1;
      });
      const survivor = docs[0];

      if (!survivor || survivor._id !== addRes._id) {
        // Ours is not the survivor — remove only our own doc.
        await applications.doc(addRes._id).remove();
        return {
          ok: false,
          error: 'DUPLICATE_PENDING',
          message: '您已有一份待审核的入驻申请，请耐心等待审核结果。'
        };
      }
      // Ours IS the survivor — clean up the others (concurrent calls may race
      // to remove the same doc; ignore individual failures).
      for (const doc of docs.slice(1)) {
        try {
          await applications.doc(doc._id).remove();
        } catch (removeErr) {
          // already removed by the other call — fine
        }
      }
    }

    return { ok: true, id: addRes._id };
  } catch (err) {
    console.error('submitTutorApplication failed:', err);
    return { ok: false, error: err.message };
  }
};
