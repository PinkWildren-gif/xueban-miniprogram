# 学伴 Launch Runbook — The Human Steps

Everything in the codebase is done by Claude. This file lists the steps **only you (Andi) or your dad can do**, in order, with time estimates. Work through it top to bottom.

---

## Step 0 — See it on your phone (5 minutes, do this today)

The Preview button silently fails because the project uses the placeholder AppID `touristappid` ("游客模式" / tourist mode). Tourist mode works in the simulator only — WeChat's servers refuse to build a phone preview for an AppID they don't recognize. The `Error: timeout` in your console was exactly this.

**Fix — get a free Test AppID (测试号):**

1. Open this page in a browser and log in with your WeChat (scan QR):
   https://mp.weixin.qq.com/wxamp/sandbox?doc=1
   This is the official Mini Program **test account** (测试号) page. It instantly issues you a real `wx...` AppID with no ID card, no company, no payment.
2. Copy the AppID it shows.
3. In WeChat DevTools: top-right **详情 (Details)** panel → 基本信息 → AppID → **修改** → paste the test AppID → confirm.
   (If you can't find Details: menu bar → 项目 → 重新打开此项目, and set the AppID in the import dialog. Or edit `project.config.json` and change `"appid": "touristappid"` to your test ID, then reopen the project.)
4. Click **编译 (Compile)**, then **预览 (Preview)**. A QR code appears → scan with your phone's WeChat.

**Test AppID limits (fine for now):** no CloudBase, no real wx.login user identity, can't be published. It exists purely for development and phone preview.

---

## Step 1 — Real Mini Program account (start NOW — it gates everything else)

A test AppID can never be published. You need a registered Mini Program account. Two routes:

| | 个人 (Individual) | 企业 (Company) |
|---|---|---|
| Needs | Chinese ID (身份证) + Chinese phone + Chinese bank card for verification | Business license (营业执照) + legal-rep ID |
| Cost | Free | ¥300/year verification (认证) |
| Can publish | Yes, limited categories | Yes, all categories incl. education |
| WeChat Pay | ❌ No | ✅ Yes |
| **Education category** | ❌ Education services category requires enterprise + qualifications | ✅ With 办学许可/ICP as needed |

**Recommendation:** register under your dad's publishing company (he already has the business license). An education-information service positioned as 教育信息服务 will pass category review far more easily under a company, and you'll eventually need WeChat Pay anyway.

**How (dad does this, ~30 min + 1-3 days review):**
1. https://mp.weixin.qq.com → 立即注册 → 小程序
2. Email (one not bound to any WeChat account) → verify
3. 主体类型: 企业 → fill 营业执照 info → pay ¥300 认证 or use 对公打款 (small bank transfer verification, free)
4. Once approved: 设置 → 基本设置 shows the real **AppID** → send it to you → put it in `project.config.json`
5. In 成员管理 add your WeChat as 开发者 (developer) so you can preview/upload

---

## Step 2 — Legal filings (start in parallel — 15–20 business days)

From Yong's research, for a tutor-information platform operating in China:

1. **ICP 备案** (mandatory for any online service): filed through the cloud/hosting provider (Tencent Cloud makes this semi-automated once you have a server/CloudBase). Needs the company license + legal rep ID + ~10-20 business days. The compliance page already shows a placeholder: `滇ICP备XXXXXXXX号（备案申请中）` — replace when issued.
2. **EDI / 增值电信业务许可** — only if the platform later takes payment as an intermediary. Pure information display (current model, 0% commission, no money flows through platform) generally doesn't trigger it. Re-check when monetization starts.
3. **教育APP备案 (教育移动互联网应用程序备案)** — applies to education apps; mini programs in the education category may be asked for it during WeChat category review. The "信息服务平台, not 培训机构" positioning (already encoded in the terms page §平台性质) is the defense; have dad's company lawyer confirm.
4. **网络安全等级保护 (MLPS)** — needed at scale; not a blocker for a closed alpha.

---

## Step 3 — Backend: Tencent CloudBase (1 evening, after Step 1)

Everything is pre-built in `cloudfunctions/` — follow `CLOUDBASE-SETUP.md`. Requires the real AppID from Step 1 (test AppIDs cannot use CloudBase). Free tier covers a closed alpha comfortably.

---

## Step 4 — Closed alpha (the Level-3 plan)

1. Recruit **20 tutors** — Yunnan Normal University students/recent grads are the natural first cohort (the data model's tutor profiles mirror exactly what to collect; the in-app 成为学伴老师 flow is live).
2. Verification: collect 身份证 + 学历 + 教师资格 photos via the signup flow; manually approve (the admin moderation queue exists in the web demo; the mini-program stores applications pending CloudBase).
3. Recruit 10–20 parent testers through dad's company contacts in Kunming.
4. Watch the `contacts` collection in CloudBase — that's the wizard-of-oz inbox: when a parent requests contact, YOU manually broker the introduction at first. Automate only what hurts.

## Step 5 — QR codes in books

- Format to print: a Mini Program Code (小程序码) generated per book via the `wxacode.getUnlimited` API with `scene=book:<bookKey>` (e.g. `book:人教·数学·五上`), page `pages/match/match`. This requires the published mini program.
- For the pilot batch before publication: print a normal QR to a simple landing page (the GitHub Pages web demo works) with a "coming to WeChat" message — or wait for publication; reprinting is expensive, publishing first is strongly recommended.
- Pilot: 5 titles, primary-school math/Chinese (highest tutor coverage in the data: 人教·数学·五上 has the most matched tutors).

## Step 6 — Publish

1. DevTools → 上传 (Upload) → version + notes
2. mp.weixin.qq.com → 版本管理 → submit for review (审核)
3. Category: 教育 → 教育信息服务. Review usually 1–7 days. Common rejection reasons to pre-empt: missing ICP (Step 2), category qualification asked (company cert), test/demo content visible (the 演示模式 banners must be removed before submission — search the repo for `演示`).

---

## 给爸爸的清单 (Checklist for Dad — Chinese)

1. **注册小程序** (约30分钟): 用公司营业执照在 mp.weixin.qq.com 注册"小程序"账号（企业主体），完成认证（¥300 或对公打款）。注册后把 **AppID** 发给 Andi，并在"成员管理"里把 Andi 的微信加为开发者。
2. **ICP备案**: 委托公司行政/法务通过腾讯云提交 ICP 备案（需营业执照+法人身份证），周期约15-20个工作日。
3. **法务确认**: 请公司法律顾问确认"教师信息服务平台"定位下是否需要教育APP备案。
4. **试点教材**: 选 5 本小学数学/语文教材试印二维码（建议等小程序发布后用正式小程序码）。
5. **老师招募**: 通过云南师范大学渠道推荐首批 20 位老师。

---

## Current status snapshot (2026-06-10)

- **Mini program**: 13 pages + compliance modal, full 24-tutor seed DB, chat/booking/signup flows working locally. Simulated: chat replies, booking confirmations, application review.
- **Backend**: written, not deployed (blocked on real AppID).
- **Web demo**: live at https://pinkwildren-gif.github.io/yunnan-tutor-demos/ — use for pitching.
- **Blockers, in order**: real AppID → CloudBase deploy → ICP → tutors → publish.
