// cloudfunctions/getTutors/index.js
// Queries the 'tutors' collection with the same filter semantics as the
// client-side list in pages/tutors/tutors.js, plus book filtering used by
// pages/books and pages/match.
//
// event (all fields optional):
//   {
//     category: '学科' | '艺术' | '素质' | 'all',
//     grade:    '小学' | '初中' | '高中' | 'all',   // matches tutors whose grades[] contains it
//     district: '五华区' | ... | 'all',
//     search:   string,                              // matches name / school / subjects / tags (case-insensitive)
//     bookKey:  string,                              // prefix match on books[], e.g. '人教·数学' or full '人教·数学·五上'
//     sort:     'rating' | 'priceAsc' | 'priceDesc' | 'years'  (or sortIdx number 0-3),
//     page:     number >= 1   (default 1),
//     pageSize: number 1-100  (default 50 — the full catalog is small)
//   }
//
// Returns: { ok: true, list, total, page, pageSize }
//          { ok: false, error }

const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// Escape user input before building a RegExp so '·', '(' etc. are literal.
function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Normalize sort: accept the string keys above or the client's sortIdx 0-3.
const SORTS = {
  rating: ['rating', 'desc'],
  priceAsc: ['price', 'asc'],
  priceDesc: ['price', 'desc'],
  years: ['years', 'desc'],
  0: ['rating', 'desc'],
  1: ['price', 'asc'],
  2: ['price', 'desc'],
  3: ['years', 'desc']
};

exports.main = async (event) => {
  const e = event && typeof event === 'object' ? event : {};

  // ---- defensive input normalization ------------------------------------
  const category = typeof e.category === 'string' ? e.category.trim() : '';
  const grade = typeof e.grade === 'string' ? e.grade.trim() : '';
  const district = typeof e.district === 'string' ? e.district.trim() : '';
  const search = typeof e.search === 'string' ? e.search.trim().slice(0, 50) : '';
  const bookKey = typeof e.bookKey === 'string' ? e.bookKey.trim().slice(0, 50) : '';

  const [sortField, sortDir] = SORTS[e.sort] || SORTS.rating;

  let page = parseInt(e.page, 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  let pageSize = parseInt(e.pageSize, 10);
  if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = 50;
  if (pageSize > 100) pageSize = 100;

  // ---- build where conditions (AND of all active filters) ---------------
  const conds = [];

  if (category && category !== 'all') {
    conds.push({ category });
  }
  if (grade && grade !== 'all') {
    // Equality against an array field matches documents whose array CONTAINS
    // the value — mirrors t.grades.includes(grade) on the client.
    conds.push({ grades: grade });
  }
  if (district && district !== 'all') {
    conds.push({ district });
  }
  if (bookKey) {
    // Prefix match so both a full key ('人教·数学·五上') and a series prefix
    // ('人教·数学') hit; the RegExp is tested against each element of books[].
    conds.push({
      books: db.RegExp({ regexp: '^' + escapeRegExp(bookKey), options: '' })
    });
  }
  if (search) {
    const re = db.RegExp({ regexp: escapeRegExp(search), options: 'i' });
    // Same fields the client searches: name, school, subjects[], tags[].
    conds.push(_.or([{ name: re }, { school: re }, { subjects: re }, { tags: re }]));
  }

  const baseQuery =
    conds.length > 0
      ? db.collection('tutors').where(_.and(conds))
      : db.collection('tutors');

  // ---- query -------------------------------------------------------------
  try {
    const countRes = await baseQuery.count();
    const total = countRes.total;

    const listRes = await baseQuery
      .orderBy(sortField, sortDir)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    return { ok: true, list: listRes.data, total, page, pageSize };
  } catch (err) {
    console.error('getTutors failed:', err);
    return { ok: false, error: err.message };
  }
};
