# 学伴 (XueBan) — WeChat Mini Program

A WeChat Mini Program (微信小程序) that connects parents in Yunnan with vetted local tutors. The core loop: scan the QR code printed in a textbook → see tutors who teach **that exact book** in your district → chat → book a trial lesson.

Three design commitments:

- **0% commission** — the platform charges tutors nothing; pricing is between parent and tutor.
- **Double-Reduction (双减) compliant by design** — booking flow blocks school-night and holiday academic-subject sessions, tutor applications require a compliance pledge, and a first-launch modal explains the policy posture.
- **Local-first** — Kunming districts, Yunnan schools, real textbook editions used in local classrooms.

## Features

- **Browse / filter / search tutors** — 24 seed tutors filterable by category (学科/艺术/素质), subject, grade, district, mode; keyword search; sort by rating/price/experience; favorites persisted on device.
- **Book catalog + match engine** — 37 textbooks (人教/北师大/苏教… by subject and level); scan a book QR or pick from the catalog to get ranked tutor matches for that exact book.
- **Chat** — per-tutor conversations with unread counts, a 学伴官方 platform account, and simulated tutor replies (see Status below).
- **Trial-lesson booking** — date/time/mode picker that is Double-Reduction-aware: academic-subject lessons cannot be booked into restricted slots.
- **Tutor application** — multi-step signup form ending in a compliance pledge; saved as a draft application on device.
- **Legal pages** — user agreement (服务协议), privacy policy (隐私政策), and a compliance statement page.
- **First-launch compliance modal** — shown once, acknowledgment persisted.

## Project structure

```
xueban-miniprogram/
├── app.json                    # Pages, tab bar, green nav window config
├── app.js                      # App lifecycle
├── app.wxss                    # Global design system (.card, .btn-primary, .badge-*, …)
├── project.config.json         # DevTools project config (AppID lives here)
├── sitemap.json
├── components/
│   └── compliance-modal/       # First-launch 双减 acknowledgment dialog
├── pages/
│   ├── index/                  # Home: QR scan entry, categories, featured tutors (TAB)
│   ├── tutors/                 # Browse all tutors with filters/search/sort (TAB)
│   ├── messages/               # Conversation list with unread badges (TAB)
│   ├── my/                     # Profile, favorites, lesson requests, entry links (TAB)
│   ├── tutor-detail/           # Full tutor profile: bio, books, reviews, actions
│   ├── match/                  # Scan/book result → ranked matching tutors
│   ├── books/                  # Textbook catalog grouped by grade and subject
│   ├── chat/                   # 1-to-1 conversation view (simulated replies)
│   ├── booking/                # Trial-lesson request form (双减-aware slots)
│   ├── tutor-signup/           # Multi-step tutor application + compliance pledge
│   ├── compliance/             # 双减 policy statement
│   ├── terms/                  # 服务协议
│   └── privacy/                # 隐私政策
├── utils/
│   ├── data.js                 # Static seed data: tutors, reviews, books + query helpers
│   └── store.js                # All user state (wx storage): profile, chats, requests, favorites
├── cloudfunctions/             # Tencent CloudBase functions, pre-built for migration
├── tools/
│   └── validate.js             # Static checks: JSON/JS/WXML validity, nav targets, page registration
├── CLOUDBASE-SETUP.md          # Backend migration guide
└── LAUNCH-RUNBOOK.md           # Human-only launch steps (accounts, filings, review)
```

Each page is the standard 4-file set: `.wxml` (template), `.wxss` (styles, `rpx` units), `.js` (logic), `.json` (nav title).

## How to run

1. Install [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) and log in by scanning the QR with your WeChat app.
2. **导入项目 (Import Project)** → select this folder.
3. AppID: the default `touristappid` works fully **in the simulator** — every page, every flow.
4. **Preview to a real phone** requires a real or test AppID (`touristappid` previews time out by design). Getting one takes 5 minutes — see **Step 0 in [LAUNCH-RUNBOOK.md](LAUNCH-RUNBOOK.md)**.

Optional sanity check before committing: `node tools/validate.js` from the repo root.

## Data architecture

Two layers, deliberately separated:

- **`utils/data.js`** — static seed content (24 tutors, 39 reviews, 37 books) plus pure query helpers (`getTutorById`, `getTutorsByBook`, …). Read-only from pages.
- **`utils/store.js`** — all mutable user state, backed by `wx.setStorageSync`: profile, favorites, conversations/messages, lesson requests, tutor application draft, compliance acknowledgment. Pages never touch wx storage directly.

This split is the migration seam: when Tencent CloudBase is connected, `data.js` reads become cloud database queries and `store.js` functions become sync points — page code does not change. Cloud functions are pre-built in `cloudfunctions/`; the migration steps are in **[CLOUDBASE-SETUP.md](CLOUDBASE-SETUP.md)** (requires a real AppID — test AppIDs cannot use CloudBase).

## Status: Demo / Alpha

The full UI and flows work, but some behavior is simulated until the backend is connected:

- **Chat replies** are generated locally — no real tutor receives messages.
- **Booking requests** are stored on-device only; real tutors do not see them.
- **Tutor applications** are saved locally, not submitted for review.
- No real auth (`wx.login`), no payments, single-device state only.

The path from here to a real launch — accounts, legal filings, CloudBase, WeChat review — is laid out step by step in [LAUNCH-RUNBOOK.md](LAUNCH-RUNBOOK.md).
