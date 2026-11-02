const CONTACT = {email:"", linkedin:"https://www.linkedin.com/in/dong-guo-604726444/"};
const ST = {
  merged:{n:"Merged",c:"--ok",d:"GitHub marks it merged; merge commit is on the default branch."},
  squashed:{n:"Squashed onto main",c:"--gold",d:"Closed, but the maintainer applied it to main as my commit."},
  consolidated:{n:"Consolidated",c:"--blue",d:"Closed into a maintainer PR; my commits are in main's history."},
  open:{n:"Open",c:"--warn",d:"Under review."},
  draft:{n:"Draft",c:"--muted",d:"Experimental draft; no integration claimed."},
  retained:{n:"Retained, unproven",c:"--muted",d:""},closed_unverified:{n:"Closed, unverified",c:"--muted",d:""}
};
let LANG="zh";try{LANG=localStorage.getItem("lang")||"zh"}catch(e){}
const NAMEZ={merged:"已合并",squashed:"已 squash 进 main",consolidated:"已整合",open:"审核中",draft:"草稿",retained:"已保留（未证实）",closed_unverified:"已关闭（未验证）"};
const DESCZ={merged:"GitHub 标记为已合并，合并提交在默认分支上。",squashed:"PR 已关闭，但维护者把它以我的提交应用到了 main。",consolidated:"已关闭并并入维护者的整合 PR；我的提交在 main 的历史中。",open:"审核中。",draft:"实验性草稿；不声称已整合。",retained:"",closed_unverified:""};
const nm=s=>LANG==="zh"?NAMEZ[s]:ST[s].n, ds=s=>LANG==="zh"?DESCZ[s]:ST[s].d;
const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const prs=DATA.prs, cnt=s=>prs.filter(p=>p.status===s).length;
const order=["merged","squashed","consolidated","open","draft","retained","closed_unverified"];
const sorted=[...prs].sort((a,b)=>order.indexOf(a.status)-order.indexOf(b.status)||a.repo.localeCompare(b.repo)||a.number-b.number);

/* wall */
$("total").textContent=prs.length;
$("tiles").innerHTML=sorted.map((p,i)=>`<a class="tile t-${p.status}" style="animation-delay:${i*28}ms" href="${p.url}" data-i="${i}" aria-label="${esc(p.repo+'#'+p.number+': '+p.title)}"></a>`).join("");
const tip=$("tip");
document.querySelectorAll(".tile").forEach(t=>{
  const p=sorted[t.dataset.i], show=e=>{tip.innerHTML=`${esc(p.title)}<small>${p.repo}#${p.number} · ${nm(p.status)}</small>`;tip.style.opacity=1;move(e)};
  const move=e=>{const x=e.clientX??t.getBoundingClientRect().left,y=e.clientY??t.getBoundingClientRect().top;tip.style.left=Math.min(x+14,innerWidth-310)+"px";tip.style.top=(y+18)+"px"};
  t.addEventListener("mouseenter",show);t.addEventListener("mousemove",move);t.addEventListener("mouseleave",()=>tip.style.opacity=0);
  t.addEventListener("focus",show);t.addEventListener("blur",()=>tip.style.opacity=0);
});
function buildLegend(){
  $("legend").innerHTML=order.filter(cnt).map(s=>`<div class="leg"><span class="sw t-${s}"></span><div><b data-n="${cnt(s)}">0</b>${nm(s)}<br><span style="font-size:12.5px">${ds(s)}</span></div></div>`).join("");
  document.querySelectorAll(".leg b").forEach(b=>{const to=+b.dataset.n;let v=0;const t=setInterval(()=>{v++;b.textContent=v;if(v>=to)clearInterval(t)},Math.max(30,600/to))});
}
const by=r=>prs.filter(p=>p.repo===r), m=(r,s)=>by(r).filter(p=>p.status===s).length;
function fill(){
  const R=(r,k)=>m(r,k);
  const txt={
    mad:z=>z?`${by("willfaust/Madeira").length} 个 PR：${R("willfaust/Madeira","merged")} 已合并 · ${R("willfaust/Madeira","squashed")} 已 squash · ${R("willfaust/Madeira","consolidated")} 已整合`:`${by("willfaust/Madeira").length} PRs: ${R("willfaust/Madeira","merged")} merged · ${R("willfaust/Madeira","squashed")} squashed · ${R("willfaust/Madeira","consolidated")} consolidated`,
    pdf:z=>z?`${by("PDFCraftTool/pdfcraft").length} 个 PR：${R("PDFCraftTool/pdfcraft","merged")} 已合并 · ${R("PDFCraftTool/pdfcraft","open")} 审核中`:`${by("PDFCraftTool/pdfcraft").length} PRs: ${R("PDFCraftTool/pdfcraft","merged")} merged · ${R("PDFCraftTool/pdfcraft","open")} open`,
    job:z=>z?`${by("DaKheera47/job-ops").length} 个 PR：${R("DaKheera47/job-ops","merged")} 已合并 · ${R("DaKheera47/job-ops","open")} 审核中`:`${by("DaKheera47/job-ops").length} PRs: ${R("DaKheera47/job-ops","merged")} merged · ${R("DaKheera47/job-ops","open")} open`,
    total:z=>z?`${prs.length} 个 PR——${cnt("merged")} 已合并，${cnt("squashed")} 已 squash 进 main，${cnt("consolidated")} 已整合，${cnt("open")+cnt("draft")} 审核中/草稿`:`${prs.length} PRs — ${cnt("merged")} merged, ${cnt("squashed")} squashed onto main, ${cnt("consolidated")} consolidated, ${cnt("open")+cnt("draft")} open/draft`
  };
  document.querySelectorAll("[data-fill]").forEach(el=>el.textContent=txt[el.dataset.fill](el.closest(".sheet").dataset.lang==="zh"));
}
if(CONTACT.email||CONTACT.linkedin)document.querySelectorAll(".contact").forEach(e=>e.innerHTML=(CONTACT.email?` · ${esc(CONTACT.email)}`:"")+(CONTACT.linkedin?` · <a href="${esc(CONTACT.linkedin)}">LinkedIn</a>`:""));

/* case studies (hand-written; mirrors CASE_STUDIES.md) */
let cur=0;
function showCase(i){
  cur=i;const zh=LANG==="zh",c=zh?{...CASES[i],...CASEZ[i],chain:CASES[i].chain.map((x,k)=>[CASEZ[i].chain[k][0],CASEZ[i].chain[k][1],x[2]])}:CASES[i];
  const L=zh?{b:"之前",a:"之后",p:"问题",ap:"方法",v:"验证",u:"上游结果",e:"证据链"}:{b:"Before",a:"After",p:"Problem",ap:"Approach",v:"Validation",u:"Upstream",e:"Evidence chain"};
  document.querySelectorAll(".tab").forEach((t,k)=>t.setAttribute("aria-selected",k===i));
  $("case").innerHTML=`<div class="ba"><span class="repo">${esc(c.repo)}</span><h3>${esc(c.title)}</h3>
   <div class="pair"><div class="metric before"><small>${L.b}</small><strong>${esc(c.bl)}</strong><small style="text-transform:none;letter-spacing:0">${esc(c.bv)}</small></div><div class="arrow">↓</div>
   <div class="metric after"><small>${L.a}</small><strong>${esc(c.al)}</strong><small style="text-transform:none;letter-spacing:0">${esc(c.av)}</small></div></div><p class="src">${esc(c.src)}</p></div>
   <div class="body"><div class="step"><b>${L.p}</b><span>${esc(c.problem)}</span></div><div class="step"><b>${L.ap}</b><span>${esc(c.approach)}</span></div>
   <div class="step"><b>${L.v}</b><span>${esc(c.validation)}</span></div><div class="step"><b>${L.u}</b><span>${esc(c.outcome)}</span></div>
   <div><div class="kicker" style="margin-bottom:8px">${L.e}</div><div class="chain">${c.chain.map(([k,t,u])=>`<a class="link" href="${u}"><small>${esc(k)}</small><span>${esc(t)}</span></a>`).join("")}</div></div></div>`;
}
function buildTabs(){$("tabs").innerHTML=CASES.map((c,i)=>`<button class="tab" role="tab" data-i="${i}">${esc(LANG==="zh"?CASEZ[i].tab:c.tab)}</button>`).join("")}
$("tabs").addEventListener("click",e=>{const b=e.target.closest(".tab");if(b)showCase(+b.dataset.i)});

/* explorer */
$("count").textContent=prs.length;$("gen").textContent=DATA.generated_on;
function buildSelects(){const r0=$("repo").value,s0=$("status").value;
  $("repo").innerHTML=`<option value="">${LANG==="zh"?"全部仓库":"All repositories"}</option>`+[...new Set(prs.map(p=>p.repo))].map(r=>`<option>${r}</option>`).join("");
  $("status").innerHTML=`<option value="">${LANG==="zh"?"全部状态":"All statuses"}</option>`+order.filter(cnt).map(k=>`<option value="${k}">${nm(k)}</option>`).join("");
  $("repo").value=r0;$("status").value=s0;$("q").placeholder=LANG==="zh"?"搜索标题或描述":"Search title or description"}
function render(){
  const q=$("q").value.toLowerCase(),r=$("repo").value,s=$("status").value;
  const rows=sorted.filter(p=>(!r||p.repo===r)&&(!s||p.status===s)&&(!q||(p.title+" "+p.summary).toLowerCase().includes(q)));
  $("list").innerHTML=rows.length?rows.map(p=>`<div class="r"><div class="id">${p.repo}#${p.number}</div><div><a href="${p.url}">${esc(p.title)}</a>${p.summary?`<small>${esc(p.summary)}</small>`:""}</div><span class="badge" style="color:var(${ST[p.status].c})">${nm(p.status)}</span></div>`).join(""):`<div class="none">${LANG==="zh"?"没有匹配的 pull request。":"No matching pull requests."}</div>`;
}
["q","repo","status"].forEach(i=>$(i).addEventListener("input",render));

/* chrome */
const root=document.documentElement;
try{const t=localStorage.getItem("theme");if(t)root.dataset.theme=t}catch(e){}
const tb=$("theme"),sync=()=>tb.textContent=LANG==="zh"?(root.dataset.theme==="dark"?"浅色":"深色"):(root.dataset.theme==="dark"?"Light":"Dark");
tb.onclick=()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";sync();try{localStorage.setItem("theme",root.dataset.theme)}catch(e){}};
$("print").onclick=()=>{document.getElementById("resume").scrollIntoView();setTimeout(()=>print(),250)};
addEventListener("pointermove",e=>{const h=document.querySelector(".hero");h.style.setProperty("--mx",e.clientX+"px");h.style.setProperty("--my",(e.clientY+scrollY)+"px")},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));


/* ---------- language ---------- */
const ZH=[
 [".nav li:nth-child(1) a","贡献"],[".nav li:nth-child(2) a","案例"],[".nav li:nth-child(3) a","项目"],[".nav li:nth-child(4) a","简历"],[".nav li:nth-child(5) a","全部 PR"],[".experience-nav","经历"],["#print","简历 PDF"],
 [".hero .kicker","滑铁卢大学 · 数学荣誉学士（Co-op）· 2026 年 9 月入学"],
 [".tag","<span>复现</span>问题。<span>修补</span>它。<span>证明</span>它不再复发。"],
 [".lede","数学系大一学生，对软件工程、数据科学和量化开发感兴趣。我开发学生工具、参与开源，也通过团队创业项目、研究展示与短片创作探索想法。工程实践从可复现的问题开始，以验证证据收尾。"],
 [".hero .cta a:nth-child(1)","查看证据 →"],[".hero .cta a:nth-child(3)","简历"],
 [".facts span:nth-child(1)","<b>求职</b> 软件工程 Co-op / 实习"],[".facts span:nth-child(2)","<b>语言</b> TypeScript · Rust · C"],[".facts span:nth-child(3)","<b>时区</b> America/Toronto"],
 [".wallhead h2",`<i id="total">${prs.length}</i> 个提交给他人项目的 pull request。<br>每个一块方块。`],
 [".wallhead p","悬停或点按方块查看 PR。颜色代表状态，已对照 GitHub 和各项目 <code>main</code> 的历史核实。没有任何重复计数。"],
 [".wallbox .fine","“squash”和“整合”的 PR 单独标示，<b>不</b>计为已合并。这些工作大多借助 AI 编程助手完成（PR 描述中已注明）；我负责界定问题、审查 diff、检查测试。我自己仓库里的 PR 不包含在内。"],
 [".method div:nth-child(1) h3","复现"],[".method div:nth-child(1) p","先写出会失败的用例：ASan/UBSan 测试、真实 PDF 往返、跨时区矩阵。"],
 [".method div:nth-child(2) h3","修补"],[".method div:nth-child(2) p","针对根因做最小改动，方便维护者审查。"],
 [".method div:nth-child(3) h3","验证"],[".method div:nth-child(3) p","证明修复前失败、修复后通过，并如实说明哪些没测。"],
 [".method div:nth-child(4) h3","上游"],[".method div:nth-child(4) p","回复维护者，然后附上证明已落地的提交链接。"],
 ["#cases .sh .kicker","案例研究"],["#cases .sh h2","修复前、修复后，<em>附上凭证。</em>"],["#cases .sh p","左侧的数字是我的 PR 自述的结果；右侧的链条是维护者实际做了什么。这是两类不同的证据，页面上分开标注。"],
 ["#projects .sh .kicker","原创作品"],["#projects .sh h2","我<em>做的东西。</em>"],["#projects .sh p","独立项目，与上面的贡献数字分开。"],
 [".feature .kicker","Edge 扩展 · TypeScript · v1.9.0"],
 [".feature p:not(.fine)","把 LEARN、Crowdmark、Odyssey 上的 Waterloo 截止日期、考试和成绩放进同一个侧边栏。它在你自己已登录的会话里读取各站点，数据留在浏览器里，从不接触密码，也不会替你提交任何内容。"],
 [".feature .fine","独立学生项目，不是滑铁卢大学的产品。Edge 加载项商店的上架还在审核中；可从 GitHub Releases 安装。"],
 [".feature .cta a:nth-child(1)","最新版本"],[".feature .cta a:nth-child(2)","源码"],
 [".mini a:nth-child(1) p","本地优先的 macOS 一对一聊天分析：只读访问、匿名化、SQLite、Keychain。"],
 [".mini a:nth-child(2) p","本地优先的桌面应用，帮助理解不熟悉的代码库。"],
 [".mini a:nth-child(3) p","注重隐私的桌面应用，用于重新发现文件活动。"],
 [".mini a:nth-child(4) p","非官方研究分支：在 iPad 上探索 Windows x64 Vulkan。尚未完成；不是官方移植。"],
 ["#resume .sh .kicker","简历"],["#resume .sh h2","完整<em>简历。</em>"],["#resume .sh p","教育、工程实践与精选活动。顶部“简历 PDF”打印当前语言版本，活动经历单独排在第二页。"],
 ["#explorer .sh .kicker","完整记录"],["#explorer .sh h2","每一个 <em>pull request。</em>"],
 ["#explorer .sh p",`<span id="count">${prs.length}</span> 个外部 pull request，数据与上方马赛克墙相同。更新于 <span id="gen">${DATA.generated_on}</span>。`],
 ["footer .big",`阅读<a href="https://github.com/Jelly-RayTian/Jelly-RayTian/blob/main/OPEN_SOURCE_CONTRIBUTIONS.md">完整记录</a>。`],
 ["footer p",`开源贡献附有 PR、维护者评论或提交链接；活动与教育信息来自个人简历及项目记录。贡献源码与数据：<a href="https://github.com/Jelly-RayTian/Jelly-RayTian">Jelly-RayTian/Jelly-RayTian</a>。`]
];
function applyLang(){
  root.dataset.lang=LANG;root.lang=LANG==="zh"?"zh-CN":"en";
  ZH.forEach(([sel,zh])=>document.querySelectorAll(sel).forEach(el=>{if(el.dataset.en===undefined)el.dataset.en=el.innerHTML;el.innerHTML=LANG==="zh"?zh:el.dataset.en}));
  $("lang").textContent=LANG==="zh"?"EN":"中文";
  document.title=LANG==="zh"?"Ray Tian — 作品集":"Ray Tian — Portfolio";
  buildLegend();fill();buildTabs();showCase(cur);buildSelects();render();sync();
}
$("lang").onclick=()=>{LANG=LANG==="zh"?"en":"zh";try{localStorage.setItem("lang",LANG)}catch(e){}applyLang()};

/* ---------- effects ---------- */
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches, FINE=matchMedia("(pointer:fine)").matches;
const css=n=>getComputedStyle(root).getPropertyValue(n).trim();
/* constellation background */
(function(){
  const cv=$("bg"),ctx=cv.getContext("2d");let W,H,dpr,nodes=[],mx=-9999,my=-9999,col={a:"#f2c14e",b:"#7fa8ff"};
  const pal=()=>{col.a=css("--gold");col.b=css("--blue")};
  function size(){dpr=Math.min(devicePixelRatio||1,2);W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr;
    const n=innerWidth<700?34:Math.round(innerWidth*innerHeight/17000);
    while(nodes.length<n)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35*dpr,vy:(Math.random()-.5)*.35*dpr,r:(Math.random()*1.4+.7)*dpr});
    nodes.length=n}
  function frame(){
    ctx.clearRect(0,0,W,H);const L=150*dpr,M=210*dpr;
    for(const p of nodes){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      const dx=p.x-mx*dpr,dy=p.y-my*dpr,d=Math.hypot(dx,dy);if(d<M&&d>0){p.x+=dx/d*.6*dpr;p.y+=dy/d*.6*dpr}}
    ctx.lineWidth=dpr;
    for(let i=0;i<nodes.length;i++){const a=nodes[i];
      for(let j=i+1;j<nodes.length;j++){const b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<L){ctx.globalAlpha=(1-d/L)*.38;ctx.strokeStyle=col.b;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
      const d=Math.hypot(a.x-mx*dpr,a.y-my*dpr);
      if(d<M){ctx.globalAlpha=(1-d/M)*.7;ctx.strokeStyle=col.a;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mx*dpr,my*dpr);ctx.stroke()}
      ctx.globalAlpha=.8;ctx.fillStyle=d<M?col.a:col.b;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,6.283);ctx.fill()}
    if(!RM&&!document.hidden)requestAnimationFrame(frame)}
  addEventListener("resize",size);addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY},{passive:true});
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!RM)requestAnimationFrame(frame)});
  new MutationObserver(pal).observe(root,{attributes:true,attributeFilter:["data-theme"]});
  pal();size();frame();
})();
/* scroll progress */
const prog=$("prog");addEventListener("scroll",()=>{prog.style.transform=`scaleX(${scrollY/(document.body.scrollHeight-innerHeight||1)})`},{passive:true});
/* name scramble */
if(!RM){const G="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz∑∫∂π√";
  [["n1","Ray",0],["n2","Tian",260]].forEach(([id,txt,delay])=>{const el=$(id);let f=0;
    setTimeout(()=>{const t=setInterval(()=>{f++;el.textContent=[...txt].map((c,i)=>i<f/3?c:G[Math.floor(Math.random()*G.length)]).join("");if(f>=txt.length*3){el.textContent=txt;clearInterval(t)}},45)},delay)})}
/* wave on PR wall */
document.querySelectorAll(".tile").forEach(t=>t.addEventListener("animationend",()=>{t.style.animation="none";t.style.opacity=1;t.style.transform=""}));
const wall=$("tiles");
if(FINE&&!RM){wall.addEventListener("pointermove",e=>{document.querySelectorAll(".tile").forEach(t=>{const r=t.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));t.style.transform=d<110?`scale(${1+(1-d/110)*.7})`:""})});
  wall.addEventListener("pointerleave",()=>document.querySelectorAll(".tile").forEach(t=>t.style.transform=""))}
/* 3D tilt + magnetic buttons + cursor ring */
if(FINE&&!RM){
  const tiltOn=el=>{el.classList.add("tilt");el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-3px)`});el.addEventListener("pointerleave",()=>el.style.transform="")};
  document.querySelectorAll(".mini a,.method div,.metric,.feature img").forEach(tiltOn);
  document.querySelectorAll(".btn,.pill.solid").forEach(b=>{b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.35}px)`});b.addEventListener("pointerleave",()=>b.style.transform="")});
  const cur=$("cur");let cx=0,cy=0,tx=0,ty=0;
  addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY;cur.classList.add("on");cur.classList.toggle("big",!!e.target.closest("a,button,.tile,.tab,select,input"))},{passive:true});
  document.addEventListener("pointerleave",()=>cur.classList.remove("on"));
  (function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
}
applyLang();
