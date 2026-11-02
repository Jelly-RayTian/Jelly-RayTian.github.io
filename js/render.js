// Rendering helpers. Pure string builders (no DOM access at load time) so tools/build-resume.mjs
// can reuse resumeSheet() to produce the one-page PDF from the same data as the website.
const rx = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const GH = {
  mad: "https://github.com/willfaust/Madeira/pull/",
  pdf: "https://github.com/PDFCraftTool/pdfcraft/pull/",
  job: "https://github.com/DaKheera47/job-ops/pull/"
};
const prLink = (base, n) => `<a href="${base}${n}">#${n}</a>`;

function sectionHead(id, lang) {
  const s = CONTENT.sections[id][lang];
  return `<span class="kicker">${s.k}</span><h2>${s.h}</h2><p>${s.p}</p>`;
}

function entryCard(e, lang) {
  const t = e[lang];
  const meta = [t.date].filter(Boolean).join(" · ");
  return `<article class="experience-card xcard">
    ${meta ? `<p class="kicker">${rx(meta)}</p>` : ""}
    <h3>${rx(t.title)}</h3>
    <p class="role">${rx(t.role)}</p>
    ${t.bullets ? `<ul class="xlist">${t.bullets.map(b => `<li>${rx(b)}</li>`).join("")}</ul>` : ""}
    ${t.note ? `<p class="xnote">${rx(t.note)}</p>` : ""}
    ${t.tags ? `<p class="experience-tags">${rx(t.tags)}</p>` : ""}
  </article>`;
}

function entriesFor(section, lang) {
  return `<div class="experience-grid">${CONTENT.entries.filter(e => e.section === section).map(e => entryCard(e, lang)).join("")}</div>`;
}

function educationHTML(lang) {
  const L = lang === "zh" ? {cw: "相关课程", lang: "语言"} : {cw: "Relevant coursework", lang: "Languages"};
  return `<div class="edu-grid">${CONTENT.education.map(ed => {
    const t = ed[lang];
    return `<article class="edu-card xcard"><p class="kicker">${rx(t.date)}</p><h3>${rx(t.org)}</h3>
      <p class="role">${rx(t.degree)}</p><p class="edu-place">${rx(t.place)}${t.detail ? " · " + rx(t.detail) : ""}</p>
      <p class="edu-cw"><b>${L.cw}</b></p><ul class="chips">${t.coursework.map(c => `<li>${rx(c)}</li>`).join("")}</ul></article>`;
  }).join("")}</div>
  <div class="skills-panel xcard"><h3>${lang === "zh" ? "技能（如实分级）" : "Skills, honestly tiered"}</h3>
    <dl>${CONTENT.skills.map(s => `<div><dt>${rx(s.label[lang])}</dt><dd>${rx(s.items[lang])}</dd></div>`).join("")}
    <div><dt>${L.lang}</dt><dd>${rx(CONTENT.languages[lang])}</dd></div></dl></div>`;
}

function aboutHTML(lang) {
  return `<div class="about-grid"><p class="about-text">${rx(CONTENT.about[lang])}</p>
    <div><h3 class="mini-h">${lang === "zh" ? "兴趣" : "Interests"}</h3><ul class="chips">${CONTENT.interests.map(i => `<li>${rx(i[lang])}</li>`).join("")}</ul></div></div>`;
}

function achievementsHTML(lang) {
  return `<div class="honours">${CONTENT.entries.filter(e => e.section === "achievements").map(e => `<article class="honour xcard"><h3>${rx(e[lang].title)}</h3><p>${rx(e[lang].role)}</p></article>`).join("")}</div>`;
}

function contactHTML(lang) {
  return `<div class="cta"><a class="btn gold" href="https://www.linkedin.com/in/dong-guo-604726444/">LinkedIn</a><a class="btn" href="https://github.com/Jelly-RayTian">GitHub</a></div>`;
}

/* ---------- résumé (one page) ---------- */
function prStats() {
  const by = r => DATA.prs.filter(p => p.repo === r);
  const m = (r, s) => by(r).filter(p => p.status === s).length;
  return {by, m, mad: "willfaust/Madeira", pdf: "PDFCraftTool/pdfcraft", job: "DaKheera47/job-ops"};
}

function resumeSheet(lang, opts) {
  opts = opts || {};
  const S = prStats(), z = lang === "zh";
  const ed = CONTENT.education;
  const sub = [z ? "加拿大安大略省滑铁卢" : "Waterloo, Ontario, Canada", "github.com/Jelly-RayTian", "linkedin.com/in/dong-guo-604726444", "jelly-raytian.github.io"].concat(opts.extraContact || []).join(" · ");
  const pdfRight = z ? `${S.by(S.pdf).length} 个 PR：${S.m(S.pdf, "merged")} 已合并 · ${S.m(S.pdf, "open")} 审核中` : `${S.by(S.pdf).length} PRs: ${S.m(S.pdf, "merged")} merged · ${S.m(S.pdf, "open")} open`;
  const madRight = z ? `${S.by(S.mad).length} 个 PR：${S.m(S.mad, "merged")} 已合并 · ${S.m(S.mad, "squashed")} 已 squash 进 main · ${S.m(S.mad, "consolidated")} 已整合` : `${S.by(S.mad).length} PRs: ${S.m(S.mad, "merged")} merged · ${S.m(S.mad, "squashed")} squashed onto main · ${S.m(S.mad, "consolidated")} consolidated`;
  const jobRight = z ? `${S.by(S.job).length} 个 PR：${S.m(S.job, "merged")} 已合并 · ${S.m(S.job, "open")} 审核中` : `${S.by(S.job).length} PRs: ${S.m(S.job, "merged")} merged · ${S.m(S.job, "open")} open`;
  const lead = CONTENT.entries.filter(e => e.resume && e.resume.title);
  const euclid = CONTENT.entries.find(e => e.id === "euclid"), piano = CONTENT.entries.find(e => e.id === "piano");

  const T = z ? {
    edu: "教育背景", skills: "技术技能", exp: "相关技术经历", proj: "精选项目", lead: "领导力与志愿服务", hon: "荣誉与资格",
    cw: "相关课程", ai: "借助 AI 编程助手开发：我负责界定问题、审查 diff、编写并运行测试、回复维护者。",
    ossTitle: "开源贡献者 — PDFCraft、Madeira、job-ops", ossDate: "2026 年 10 月 – 至今",
    pdf: [`旋转 PDF 时通过原地更新页面，保留表单、书签、链接与附件；修复前 11 个回归用例失败，修复后 12 个真实保存重载测试通过（${prLink(GH.pdf, 266)}）。`,
          `修复 Unicode 页码标签前缀乱码（${prLink(GH.pdf, 257)}）以及过大范围导致的主线程卡死（${prLink(GH.pdf, 264)}）。`],
    mad: [`修复工作目录 ≥260 字符时的启动缓冲区覆盖；ASan/UBSan 复现修复前 12/24 个用例失败，修复后 24/24 通过；已被维护者 squash 进 main（${prLink(GH.mad, 471)}）。`,
          `避免 Steam 云同步把不可读存档当作本地修改（${prLink(GH.mad, 472)}），修复授权检查中的 Core Foundation 引用所有权（${prLink(GH.mad, 473)}）；均已在 main。`,
          `修复 MoltenVK pipeline cache 导出并提交可选 Vulkan 路径（${prLink(GH.mad, 456)}、${prLink(GH.mad, 400)}）；我的提交通过维护者整合 PR 进入 main，不计为已合并。`],
    job: [`修复 America/Toronto 下岗位日期早一天及夏令时天数错误，并在四个时区验证（${prLink(GH.job, 788)}）；新增浏览器端文本 PDF 导入（${prLink(GH.job, 789)}）；保留简历样式元数据（${prLink(GH.job, 787)}）。`],
    wat: ["WatDesk — Edge 扩展（TypeScript、React、Vite）", "2026 年 10 月 – 至今",
          ["发布 8 个版本（最新 v1.9.0）的中英双语侧边栏，整合 LEARN、Crowdmark、Odyssey 的截止日期、考试与成绩，并支持日历导出。", "数据保存在浏览器本地，不读取密码；v1.9.0 的 CI 运行类型检查、生产构建和 67 个测试文件共 284 个测试。"]],
    ws: ["WechatSignals — 本地优先的 macOS 聊天分析（TypeScript、Swift）", "2026 年 10 月", ["只读访问、请求前匿名化、API Key 存入 Keychain、仅在用户点击时发送；发布 v0.1.0-beta.1。"]],
    langs: "语言：中文（母语）；英语（IELTS Academic 7.0）"
  } : {
    edu: "Education", skills: "Technical Skills", exp: "Relevant Technical Experience", proj: "Selected Projects", lead: "Leadership & Volunteer Experience", hon: "Honours & Qualifications",
    cw: "Relevant coursework", ai: "Developed with AI coding assistants: I define each bug, review the diff, write and run tests, and respond to maintainers.",
    ossTitle: "Open-Source Contributor — PDFCraft, Madeira, job-ops", ossDate: "Oct 2026 – Present",
    pdf: [`Fixed PDF rotation dropping forms, bookmarks, links and attachments by updating pages in place; 11 regression cases failed before, 12 real save-and-reload tests pass (${prLink(GH.pdf, 266)}).`,
          `Fixed Unicode page-label prefixes saved as garbled text (${prLink(GH.pdf, 257)}) and a main-thread freeze on oversized label ranges (${prLink(GH.pdf, 264)}).`],
    mad: [`Fixed a startup buffer overwrite for working directories of 260+ characters; ASan/UBSan reproduction failed 12 of 24 cases before and passes 24/24; squashed onto main by the maintainer (${prLink(GH.mad, 471)}).`,
          `Stopped Steam Cloud sync treating unreadable saves as local edits (${prLink(GH.mad, 472)}) and fixed Core Foundation ownership in entitlement checks (${prLink(GH.mad, 473)}); both on main.`,
          `Fixed MoltenVK pipeline-cache export and proposed an opt-in Vulkan route (${prLink(GH.mad, 456)}, ${prLink(GH.mad, 400)}); my commits are in main via maintainer consolidation PRs, not counted as merged.`],
    job: [`Fixed date-only posting dates and DST day counts in America/Toronto, verified under four time zones (${prLink(GH.job, 788)}); added client-side text-PDF import (${prLink(GH.job, 789)}); preserved resume style metadata (${prLink(GH.job, 787)}).`],
    wat: ["WatDesk — Edge extension (TypeScript, React, Vite)", "Oct 2026 – Present",
          ["Built and released 8 tagged versions (latest v1.9.0) of a bilingual side panel combining LEARN, Crowdmark and Odyssey deadlines, exams and grades, with calendar export.", "Keeps data in the browser and never reads passwords; v1.9.0 CI runs type checks, a production build and 284 tests across 67 files."]],
    ws: ["WechatSignals — local-first macOS chat analysis (TypeScript, Swift)", "Oct 2026", ["Read-only access, anonymisation before any request, API key in Keychain, data sent only on an explicit click; released v0.1.0-beta.1."]],
    langs: "Languages: Mandarin Chinese (native); English (IELTS Academic 7.0)"
  };
  const row = (a, b) => `<div class="row"><div>${a}</div><span>${b}</span></div>`;
  const ul = items => `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
  const edRow = (e) => { const t = e[lang]; return row(`<b>${rx(t.org)}</b> — ${rx(t.degree)}`, rx(t.date)); };
  const e0 = ed[0][lang], e1 = ed[1][lang];
  const skillRows = CONTENT.skills.map(s => `<b>${rx(s.label[lang])}</b><span>${rx(s.items[lang])}</span>`).join("");
  const leadHTML = lead.map(e => `<div class="row item"><div><b>${rx(e.resume.title)}</b></div><span>${rx(e.resume.date)}</span></div>${ul(e.resume.en.map(rx))}`).join("");
  const zhLead = z ? CONTENT.entries.filter(e => e.resume && e.resume.title).map(e => { const t = e.zh; return `<div class="row item"><div><b>${rx(t.title)} — ${rx(t.role)}</b></div><span>${rx(t.date || "")}</span></div>${ul(t.bullets.map(rx))}`; }).join("") : "";
  const honEN = [euclid.resume.en[0], piano.resume.en[0]].map(rx).join(" · ");
  const honZH = `${rx(euclid.zh.title)}（2025）：83/100 · ${rx(piano.zh.title)}（${rx(piano.zh.role)}）`;
  return `<h3>Ray Tian</h3><div class="sub">${sub}</div>
  <h4>${T.edu}</h4>
  ${edRow(ed[0])}<div class="sub2">${rx(e0.place)} · ${T.cw}: ${e0.coursework.map(rx).join("; ")}</div>
  ${edRow(ed[1])}<div class="sub2">${rx(e1.place)} · ${rx(e1.detail)} · ${e1.resumeCoursework.map(rx).join(", ")}</div>
  <h4>${T.skills}</h4><div class="skills">${skillRows}</div>
  <h4>${T.exp}</h4>
  ${row(`<b>${T.ossTitle}</b>`, T.ossDate)}<div class="sub2">${T.ai}</div>
  ${row("<b>PDFCraft — browser PDF toolkit (TypeScript, pdf-lib)</b>", pdfRight)}${ul(T.pdf)}
  ${row("<b>Madeira — Windows-on-iOS compatibility layer (C, Swift)</b>", madRight)}${ul(T.mad)}
  ${row("<b>job-ops — self-hosted job-search tool (TypeScript)</b>", jobRight)}${ul(T.job)}
  <h4>${T.proj}</h4>
  ${row(`<b>${T.wat[0]}</b>`, T.wat[1])}${ul(T.wat[2])}
  ${row(`<b>${T.ws[0]}</b>`, T.ws[1])}${ul(T.ws[2])}
  <h4>${T.lead}</h4>${z ? zhLead : leadHTML}
  <h4>${T.hon}</h4><div>${z ? honZH : honEN}</div><div class="sub2">${T.langs}</div>`;
}

function creativeHTML(lang) {
  const z = lang === "zh", C = CONTENT.creative;
  const stats = C.stats.map(s => `<div class="cstat"><b>${rx(s.value)}</b><span>${rx(s.label[lang])}</span><small>${rx(s.src[lang])}</small></div>`).join("");
  const vids = (typeof VIDEOS !== "undefined" ? VIDEOS : []).map(v => `<a class="vid" href="${rx(v.url)}">${v.cover ? `<img src="${rx(v.cover)}" alt="" loading="lazy">` : ""}<b>${rx(v.title)}</b><small>${v.plays ? v.plays.toLocaleString() + (z ? " 播放 · " : " plays · ") : ""}${z ? "核对于 " : "checked "}${rx(v.checked)}</small></a>`).join("");
  return `<div class="cstats">${stats}</div><p class="xnote">${rx(C.note[lang])}</p>
    ${vids ? `<div class="vids">${vids}</div>` : ""}
    <div class="cta"><a class="btn gold" href="${C.profile}">${z ? "Bilibili 个人主页" : "Bilibili profile"}</a></div>`;
}
