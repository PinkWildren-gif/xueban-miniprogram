# 学伴 WeChat Mini Program — Starter Project

A working WeChat Mini Program (微信小程序) scaffold for the Yunnan tutor platform. Solo-dev, zero-budget setup.

## What's already built

- ✅ 4-page app: Home / Find Tutor (browse) / Tutor Detail / My
- ✅ Working filters: subject category, grade, district, search, sort
- ✅ Favorites (persisted in `wx.setStorageSync`)
- ✅ Native QR scanner using `wx.scanCode`
- ✅ Tab bar navigation
- ✅ 8 seed tutors ported from the web demo
- ✅ Page-to-page navigation with URL params
- ✅ Share-to-WeChat on home and detail pages

## What's NOT yet built (that's the roadmap)

- ❌ Backend (Tencent CloudBase) — data is local-only for now
- ❌ Real auth (WeChat login)
- ❌ Tutor signup flow
- ❌ Chat / messaging
- ❌ WeChat Pay integration
- ❌ Admin dashboard
- ❌ Real book database + QR-to-match logic

---

## Part A — One-time setup (do this tonight)

### Step 1: Register as individual Mini Program developer (~10 minutes)

1. Go to **https://mp.weixin.qq.com/**
2. Click the top-right "注册" button
3. Choose the **"个人"** (individual) account type — not 企业
4. Fill in:
   - Email (can be Gmail, Outlook — not already used for WeChat public account)
   - Password
   - Activate via the email confirmation link
5. Log in, then:
   - Provide your Chinese ID number (身份证) — your dad can lend his temporarily
   - Verify via WeChat (scan a QR code with WeChat mobile app)
6. Once approved, go to **设置 → 开发设置** and copy the **AppID**. It looks like `wx1234567890abcdef`.

⚠️ **Can't register from UK without a Chinese ID?** Options:
- Use your dad's 身份证 (he creates the account, shares access with you)
- Or skip registration and develop with the **Test AppID** built into WeChat Developer Tools (works for local dev but can't be shared to real phones)

### Step 2: Install WeChat Developer Tools (~5 minutes)

1. Download: **https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html**
2. Pick your OS (Mac/Windows)
3. Install, then open
4. **Log in by scanning the QR with your WeChat mobile app** (the app you use to message people)

### Step 3: Open this project in the dev tool (~2 minutes)

1. In WeChat Developer Tools, click **"+" → 导入项目** (Import Project)
2. Browse to `/Users/andilu/Desktop/ContratoYA/wechat-mini-program/`
3. AppID: paste the one you got in Step 1, OR use the default "touristappid" (works for local dev only — you won't be able to share QR codes to real phones with touristappid)
4. Project name: `学伴 MVP` (or anything)
5. Click **确定** (OK)
6. The simulator should load and show the home page 🎉

### Step 4: Test on your real phone (optional but fun)

1. In the dev tool top bar, click **预览** (Preview)
2. A QR code appears
3. Scan it with your own WeChat app
4. The Mini Program opens on your phone in a sandboxed test environment
5. (If you used "touristappid" this won't work — need a real AppID)

---

## Part B — Weekly dev plan

### Week 1: Get comfortable with Mini Program syntax
- Goal: understand WXML (≈HTML), WXSS (≈CSS), JS, JSON
- Read: https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/
- Modify this starter — change colors, text, layouts — break things on purpose

### Week 2: Set up Tencent CloudBase (free backend)
- Open https://console.cloud.tencent.com/tcb (requires Tencent Cloud account — free signup with ID)
- Create a new environment (选 "免费版" — free tier)
- In WeChat Dev Tools, enable "云开发" (Cloud Development)
- Migrate the `utils/data.js` tutor array to a CloudBase database collection

### Week 3: Real auth
- Add WeChat login (`wx.login`) to grab user's openid
- Save user profile to a `users` collection in CloudBase
- Test with 2 devices — verify each gets a unique user

### Week 4: Tutor signup flow
- Build `pages/tutor-onboard/` with multi-step form
- Use `wx.chooseImage` + CloudBase storage to upload ID photo
- Save tutor doc to `tutors` collection
- Create an admin-only page to approve pending tutors

### Week 5-6: Matching + messaging
- Real book DB (20 entries you hand-curate)
- Scan flow → ISBN lookup → match
- 1-to-1 messaging using CloudBase collections + `wx.onMessage` subscriptions

### Week 7-8: Polish + alpha release
- Apply for WeChat Pay merchant account (requires business license)
- Publish to 100-user test pool (WeChat allows 100 "experience users" without full release)
- Invite your dad's first 50 contacts

---

## Project structure

```
wechat-mini-program/
├── app.json              # Global config: pages, tabs, window
├── app.js                # App lifecycle (onLaunch)
├── app.wxss              # Global styles
├── project.config.json   # IDE / build config
├── sitemap.json          # SEO for WeChat search
├── utils/
│   └── data.js           # Tutor database + helpers (temporary)
└── pages/
    ├── index/            # Home page (scan + featured tutors)
    ├── tutors/           # Full tutor browse with filters
    ├── tutor-detail/     # Individual tutor profile
    └── my/               # User profile + favorites
```

Each page has 4 files (Mini Program convention):
- `.wxml` — template (HTML-like)
- `.wxss` — styles (CSS-like, supports `rpx` unit = responsive px)
- `.js` — logic (Page({ data, onLoad, methods }))
- `.json` — page-level config (nav bar title, etc.)

---

## Key Mini Program concepts vs. web

| Web | Mini Program |
|---|---|
| `<div>` | `<view>` |
| `<img>` | `<image>` |
| `<a href>` | `<navigator url>` OR `bindtap + wx.navigateTo` |
| `px` | `rpx` (750rpx = screen width) |
| `localStorage` | `wx.setStorageSync()` |
| `fetch()` | `wx.request()` |
| `onclick` | `bindtap` |
| `v-for` / `map` | `wx:for="{{list}}" wx:key="..."` |
| `v-if` | `wx:if="{{cond}}"` |
| Inline CSS: `style="color:red"` | Same, but in WXSS prefer classes |

---

## Helpful links

- **Official docs (Chinese):** https://developers.weixin.qq.com/miniprogram/dev/framework/
- **Mini Program design guide:** https://developers.weixin.qq.com/miniprogram/design/
- **Tencent CloudBase docs:** https://docs.cloudbase.net/
- **Component library:** https://developers.weixin.qq.com/miniprogram/dev/component/
- **API reference:** https://developers.weixin.qq.com/miniprogram/dev/api/
- **WeChat Pay integration:** https://pay.weixin.qq.com/docs/

---

## If you get stuck

1. **Red error in dev tool console** — click it, it often links to the exact file + line
2. **Template not rendering** — check `data:` in the `.js` file, and `wx:for` / `wx:if` syntax
3. **Styles not applying** — WXSS scopes are per-page; global styles live in `app.wxss`
4. **`wx.xxx` API not working** — some APIs require permission setup in `app.json`

Or just ping me with a screenshot and I'll debug.
