# CloudBase (云开发) Setup Guide — 学伴 XueBan

This document explains how to connect the mini program to Tencent CloudBase the
day a **real AppID** exists. Everything in `cloudfunctions/` is already written
and deploy-ready; nothing in the app currently depends on the cloud — the app
runs fully on the static data in `utils/data.js` and local storage in
`utils/store.js`.

---

## 0. Prerequisites — read this first

- **You need a real, registered AppID.** The tourist/test AppID (触手可及的
  "测试号" / 游客模式) **cannot** use 云开发. The "云开发" button in DevTools is
  greyed out or errors with a test AppID. Register a mini program at
  [mp.weixin.qq.com](https://mp.weixin.qq.com), complete real-name verification,
  and put the real AppID into `project.config.json` (`"appid"` key) before
  starting.
- WeChat DevTools (微信开发者工具), latest stable version.
- **Budget note:** WeChat 云开发 discontinued the free tier for newly created
  environments (since 2022). Expect the entry package at roughly **¥19.9/月**
  (or pay-as-you-go with a small base fee) — check the console's current
  pricing page when you create the environment. The entry package comfortably
  covers a closed alpha; the limits table at the end shows what to monitor.

> **Why `project.config.json` does not yet contain `cloudfunctionRoot`:**
> the key is intentionally absent while the project uses a test AppID. Adding
> it now causes DevTools to nag about a missing cloud environment on every
> compile. Add it in Step 2, after the real AppID is in place.

---

## 1. Create the cloud environment

1. Open the project in WeChat DevTools (with the real AppID set).
2. Click the **云开发** button in the toolbar (top-left, next to "模拟器").
3. First time: click **开通** and accept the terms.
4. Create an environment:
   - 环境名称: `xueban` (anything readable)
   - 套餐: pick the cheapest package offered (entry package ≈ ¥19.9/月; the
     old free 基础版 no longer exists for new environments)
5. After creation, copy the **环境 ID** (looks like `xueban-1a2b3c4d5e6f`).
   You will need it in Step 3 — although the code uses
   `cloud.DYNAMIC_CURRENT_ENV`, the client init wants an explicit env ID.

---

## 2. Point the project at `cloudfunctions/`

Edit `project.config.json` and add **one top-level key** (sibling of
`"description"`, `"setting"`, etc.):

```json
{
  "description": "学伴 XueBan — Yunnan tutor matching platform (alpha)",
  "cloudfunctionRoot": "cloudfunctions/",
  "packOptions": { "...": "unchanged" },
  "setting": { "...": "unchanged" }
}
```

Only the `"cloudfunctionRoot": "cloudfunctions/"` line is new — do not touch
anything else. After saving, DevTools re-indexes and the `cloudfunctions/`
folder icon turns into a cloud icon with the five functions listed.

---

## 3. Initialize the cloud SDK in `app.js`

Add `wx.cloud.init` at the **top of `onLaunch()`** in `app.js`:

```js
// app.js — inside App({ onLaunch() { ... } }), before anything else:
onLaunch() {
  // Initialize CloudBase. Replace the env ID with the one from Step 1.
  if (wx.cloud) {
    wx.cloud.init({
      env: 'xueban-1a2b3c4d5e6f',   // <-- your 环境 ID
      traceUser: true                // log user access in the console
    });
  } else {
    console.error('当前微信基础库过低，无法使用云能力（需 2.2.3+）');
  }

  console.log('学伴 Mini Program launched');
  // ... existing first-launch welcome-message code stays unchanged ...
}
```

The `wx.cloud` existence check matters: base library < 2.2.3 has no cloud
support. The project's minimum base library can be raised under
项目设置 → 本地设置 if needed.

---

## 4. Create the database collections

In the 云开发 console: **数据库 → 创建集合**. Create these five (names are
case-sensitive and hard-coded in the functions):

| Collection     | Written by                          | Read by                | Permission preset (权限设置)                       |
| -------------- | ----------------------------------- | ---------------------- | -------------------------------------------------- |
| `users`        | `login` (server)                    | server only            | 仅创建者可读写 (creators read their own doc)       |
| `tutors`       | `seedTutors` (server, one-time)     | client + `getTutors`   | **所有用户可读，仅管理端可写**                     |
| `reviews`      | `seedTutors` (server, one-time)     | client                 | **所有用户可读，仅管理端可写**                     |
| `applications` | `submitTutorApplication` (server)   | applicant + admin      | **仅创建者可读写**                                 |
| `contacts`     | `sendContact` (server)              | sender + admin         | **仅创建者可读写**                                 |

Notes:

- Permission presets only govern **client-side** (`wx.cloud.database()`)
  access. Cloud functions always run with admin rights, so the server-side
  writes work regardless. The presets above are the safety net for the day
  someone queries collections directly from page code.
- The server-written docs in `users` / `applications` / `contacts` carry an
  explicit `_openid` field so 仅创建者可读写 behaves correctly if the client
  ever reads them directly.
- For admin review of `applications` and `contacts` (the wizard-of-oz flow),
  use the 云开发 console's 数据库 tab — filter `status == "pending"` /
  `status == "new"`, handle the request, then edit the `status` field by hand.

Recommended indexes (数据库 → 索引管理, optional at this scale but free):

- `tutors`: `category`, `district`, `rating` (desc), `price`
- `applications`: composite `openid + status` (powers the duplicate-pending check)
- `contacts`: `status`, `createdAt` (desc)

---

## 5. Deploy the five functions

In the DevTools file tree, for **each** of:

- `cloudfunctions/login`
- `cloudfunctions/seedTutors`
- `cloudfunctions/getTutors`
- `cloudfunctions/submitTutorApplication`
- `cloudfunctions/sendContact`

right-click the folder → **上传并部署：云端安装依赖（不上传 node_modules）**.

"云端安装依赖" makes CloudBase run `npm install` server-side using each
function's `package.json` (`wx-server-sdk ~2.6.3`) — you never need a local
`node_modules` inside `cloudfunctions/`. Deployment takes ~30s per function;
watch the 云开发 console → 云函数 list until all five show 部署成功.

---

## 6. Seed the tutor data (run once)

1. 云开发 console → **云函数** → `seedTutors` → **云端测试**.
2. Leave the test event as `{}` and click **运行测试**.
3. Expected result:

```json
{
  "ok": true,
  "tutors":  { "skipped": false, "existing": 0, "inserted": 24 },
  "reviews": { "skipped": false, "existing": 0, "inserted": 39 }
}
```

Running it again is harmless — it skips any collection that already has
documents (`"skipped": true`). To re-seed from scratch, empty the `tutors` and
`reviews` collections in the console first, then run again.

---

## 7. Flip the client from static data to the cloud

Do this **page by page**, starting with the tutor list. Here is the fully
worked example for `pages/tutors/tutors.js`. The current code filters/sorts the
static `TUTORS` array locally in `applyFilters()`; the cloud version sends the
same filter state to `getTutors` and renders what comes back.

```js
// pages/tutors/tutors.js — CLOUD VERSION of applyFilters()
// (shown commented-out; swap it in once Steps 1-6 are done)
//
// Before: const { TUTORS, GRADES, DISTRICTS, ... } = require('../../utils/data.js');
// After:  keep the require for GRADES/DISTRICTS/favorites, but stop reading TUTORS:
// const { GRADES, DISTRICTS, toggleFavorite, isFavorited } = require('../../utils/data.js');
//
// applyFilters() {
//   const { activeCat, activeGrade, activeDistrict, searchText, sortIdx } = this.data;
//
//   wx.showNavigationBarLoading();
//   wx.cloud.callFunction({
//     name: 'getTutors',
//     data: {
//       category: activeCat,        // 'all' | '学科' | '艺术' | '素质'
//       grade: activeGrade,         // 'all' | '小学' | '初中' | '高中'
//       district: activeDistrict,   // 'all' | '五华区' | ...
//       search: searchText,
//       sort: sortIdx,              // 0 rating / 1 priceAsc / 2 priceDesc / 3 years
//       page: 1,
//       pageSize: 50                // whole catalog fits in one page for now
//     }
//   }).then(res => {
//     wx.hideNavigationBarLoading();
//     if (!res.result || !res.result.ok) {
//       wx.showToast({ title: '加载失败，请重试', icon: 'none' });
//       return;
//     }
//     // Annotate with local favorite state, exactly like the static version.
//     const list = res.result.list.map(t => ({ ...t, isFav: isFavorited(t.id) }));
//     this.setData({ filtered: list });
//   }).catch(err => {
//     wx.hideNavigationBarLoading();
//     console.error('getTutors failed', err);
//     wx.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
//   });
// }
```

Migration notes:

- **Keep `utils/data.js` around** until every consumer is migrated —
  `getTutorById`, `getReviewsForTutor`, `getTutorsByBook`, the books page and
  the match page still read it. Each can later become a `getTutors` call
  (`bookKey` covers the book-prefix lookups) or a direct
  `wx.cloud.database()` read against `tutors`/`reviews` (their permission
  preset allows client reads).
- Favorites stay device-local (`utils/store.js`) — no cloud change needed.
- `tutor-signup` submit becomes
  `wx.cloud.callFunction({ name: 'submitTutorApplication', data: form })`;
  check `res.result.ok` and show `res.result.error` on failure (the function
  returns Chinese, user-displayable messages and a `field` hint).
- The chat "send" action can additionally fire
  `wx.cloud.callFunction({ name: 'sendContact', data: { tutorId, message } })`
  so the request lands in the admin inbox while the local conversation UI
  keeps working as-is. **Guard it with `if (tutorId > 0)`** — tutorId 0 is the
  学伴官方 platform conversation (seeded for every user in `app.js`), and
  `sendContact` rejects non-positive tutor ids by design.
- Call `login` once in `app.js` `onLaunch` (after `wx.cloud.init`) and stash
  `res.result.openid` in `globalData` for later use.

---

## 8. Entry-package limits and what to monitor

Quotas below are indicative of the entry-level paid package (≈¥19.9/月 — the
console's 资源使用 tab has the authoritative numbers for whatever package you
buy; Tencent adjusts packages and quotas regularly):

| Resource              | Typical entry quota (per month unless noted) | XueBan alpha expectation                            |
| --------------------- | ----------------------------------- | --------------------------------------------------- |
| 云函数调用次数        | ~200,000 calls                      | `getTutors` dominates; fine below ~2,000 DAU        |
| 云函数资源使用量      | ~40,000 GBs                         | All functions are tiny (128MB, <100ms typical)      |
| 数据库读操作          | ~50,000 / day                       | Each `getTutors` call = 2 reads (count + get)       |
| 数据库写操作          | ~30,000 / day                       | Writes are rare (login upsert, applications, contacts) |
| 数据库存储            | 2 GB                                | 24 tutors + 39 reviews ≈ a few hundred KB           |
| 存储空间 (云存储)     | 5 GB, 下载 CDN 流量 ~1 GB           | Unused — no file uploads in the alpha               |
| 并发 (云函数)         | 1,000 concurrent                    | Not a concern                                       |

**What to monitor (云开发 console → 统计分析 / 资源使用):**

1. **数据库读操作/日** — the first quota you'd realistically hit. Every pull-
   to-refresh on the tutors tab costs 2 reads. If it trends past ~60% of quota,
   cache the tutor list in the page (it changes rarely) or drop the separate
   `count()` call.
2. **云函数调用次数** — spikes indicate a retry loop in client code.
3. **云函数报错率** (云函数 → 日志) — `seedTutors` "collection missing" errors
   mean Step 4 was skipped; `NO_OPENID` errors mean a call from outside the
   mini program context.
4. **`contacts` 集合的 `status == "new"` 行数** — that is the wizard-of-oz
   inbox; it is only useful if someone actually reads it daily.
5. Set the **配额告警** (quota alerts) in the console to email at 80% so a
   surprise feature in a WeChat group doesn't silently take the backend down.

When any quota is consistently above ~70%, move to 按量付费 (pay-as-you-go) —
at this app's scale the bill is pocket change, and quotas stop being a cliff.
