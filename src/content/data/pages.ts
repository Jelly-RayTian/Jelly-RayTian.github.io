import type { Lang } from '../../i18n/ui';

/** Page-level copy (headings and intros). Section content lives in content.json and the Markdown collections. */
export const pages: Record<Lang, Record<string, { k: string; h: string; p: string }>> = {
  en: {
    about: { k: 'About', h: 'Profile, education and how to reach me', p: 'Engineering is one part of how I work. The rest is organizing people, helping classmates, making things and staying curious.' },
    experience: { k: 'Experience', h: 'Hackathons, research, leadership and volunteering', p: 'Competitions and team projects, research and presentations, and the groups I started or ran.' },
    projects: { k: 'Projects', h: 'Software I have built', p: 'Independent projects and course concepts. Each page says what I built, how I checked it and where it stands.' },
    openSource: { k: 'Open source', h: 'Pull requests to other people\'s projects', p: 'Every pull request I have sent to other people\'s projects, checked against GitHub and each project\'s main history.' },
    systems: { k: 'Writing', h: 'Publications, articles and systems write-ups', p: 'A self-published technical report, published articles, and longer notes from taking apart game files, Android devices and iOS.' },
  },
  zh: {
    about: { k: '关于', h: '个人简介、教育背景与联系方式', p: '工程只是我做事的一部分。另一部分是组织同伴、帮助同学、动手创作，以及保持好奇。' },
    experience: { k: '经历', h: '黑客松、研究、领导力与志愿服务', p: '竞赛与团队项目、研究与展示，以及我发起或组织的小组。' },
    projects: { k: '项目', h: '我做过的软件', p: '独立项目与课程概念。每个项目页都会说明做了什么、怎么检查、现在进展到哪。' },
    openSource: { k: '开源', h: '提交给他人项目的 pull request', p: '我提交给他人项目的每一个 pull request，已对照 GitHub 和各项目 main 的历史核实。' },
    systems: { k: '写作', h: '报告、文章与系统探索记录', p: '一份自行发布的技术报告、已发表的文章，以及拆解游戏文件、Android 设备和 iOS 的详细记录。' },
  },
};

export const home = {
  en: {
    kicker: 'University of Waterloo · Honours Mathematics (Co-op) · Started September 2026',
    interests: 'Business analysis · Data analytics · Technology',
    lede: 'Honours Mathematics Co-op student at the University of Waterloo, interested in data-driven problem solving, product development, and technology-enabled business solutions.',
    seeking: 'Looking to join an early-stage team part-time during my study term and build real products · First Co-op work term: May–Aug 2027',
    projectsP: 'Each one starts from a problem someone really had. I say what I built, how I checked it, and where it stands today.',
    ctaProjects: 'Featured projects',
    watdesk: [['The problem', 'Waterloo deadlines, exams and grades are spread across LEARN, Crowdmark and Odyssey.'], ['What I made', 'One side panel with a timeline, a two-week workload view, exam countdowns, grades and calendar export, in English and Simplified Chinese.'], ['How I checked', '290 automated tests passed at v1.10.1; 9 tagged releases so far.'], ['Where it stands', 'Listed on Microsoft Edge Add-ons, with v1.10.1 submitted for store review. Your data stays in your browser.']],
    ossIntro: 'Each contribution starts with a problem I could reproduce. Three examples, before and after:',
    aiNote: 'WatDesk and most of my open-source fixes were built with AI coding assistants. My part is deciding which problem to solve, reviewing every change, running the tests and talking with maintainers. I did not write all of the code by hand.',
    skillsP: 'Grouped by how I actually use them. Anything marked learning or introductory is exactly that, not a claim of proficiency.',
    facts: [['Based in', 'Waterloo, Ontario'], ['Languages', 'Mandarin · English']],
    ctaEvidence: 'See my open-source work', ctaAbout: 'Projects',
    wallTitle: 'pull requests to other people\'s projects. One tile each.',
    openSourceP: 'A compact view. The full list, case studies and maintainer evidence are on the open-source page.',
    beyondH: 'More about me', beyondP: '',
    beyond: [
      { path: '/systems/', title: 'Systems exploration', text: 'Game resources, Android customization and iOS experiments.' },
      { path: '/volunteering/', title: 'Volunteering & community', text: 'Grocery coordination, peer learning, recycled-art workshops and storytelling.' },
      { path: '/creative/', title: 'Creative work', text: 'A video channel and a cross-cultural short-film project.' },
    ],
  },
  zh: {
    kicker: '滑铁卢大学 · 数学荣誉学士（Co-op）· 2026 年 9 月入学',
    interests: '商业分析 · 数据分析 · 技术',
    lede: '滑铁卢大学数学荣誉学士（Co-op）大一学生，关注数据驱动的问题解决、产品开发，以及由技术支撑的商业解决方案。',
    seeking: '希望在学期期间以兼职形式加入一个早期团队，一起做真实产品 · 第一个 Co-op work term：2027 年 5–8 月',
    projectsP: '每个项目都从别人真正遇到的问题出发。我会说明做了什么、怎么检查、现在进展到哪。',
    ctaProjects: '重点项目',
    watdesk: [['问题', '滑铁卢的截止日期、考试和成绩分散在 LEARN、Crowdmark 和 Odyssey 里。'], ['我做了什么', '一个侧边栏：时间线、两周工作量视图、考试倒计时、成绩和日历导出；支持英文和简体中文。'], ['怎么检查', 'v1.10.1 时 290 个自动化测试全部通过；目前共 9 个版本。'], ['现在的状态', '已在 Edge 加载项商店上架，v1.10.1 已提交商店审核。数据只留在你的浏览器里。']],
    ossIntro: '每个贡献都从一个我能复现的问题开始。三个例子，附修复前后：',
    aiNote: 'WatDesk 和我大部分开源修复都借助 AI 编程助手完成。我负责决定解决什么问题、审查每处改动、运行测试并与维护者沟通；并非所有代码都由我手写。',
    skillsP: '按我实际使用的方式分组。标注“学习中”或“入门”的，就是字面意思，不代表熟练。',
    facts: [['所在地', '加拿大安大略省滑铁卢'], ['语言', '中文 · English']],
    ctaEvidence: '查看开源贡献', ctaAbout: '项目',
    wallTitle: '个提交给他人项目的 pull request，每个一块方块。',
    openSourceP: '这里是精简视图。完整列表、案例研究和维护者证据在开源页面。',
    beyondH: '更多关于我', beyondP: '',
    beyond: [
      { path: '/systems/', title: '系统探索', text: '游戏资源、Android 定制与 iOS 实验。' },
      { path: '/volunteering/', title: '志愿服务与社区', text: '社区采购协调、同伴学习、回收材料艺术工作坊与讲故事。' },
      { path: '/creative/', title: '创作', text: '一个视频账号和一个跨文化短片项目。' },
    ],
  },
} as const;

export const systemsPoints: Record<Lang, string[]> = {
  en: [
    'Self-directed curiosity: I took apart systems I use to see how they work.',
    'Working from other people\'s documentation and tools, and saying which parts are theirs and which are mine.',
    'Each page says what I did and which tools and projects I used.',
  ],
  zh: [
    '自发的好奇心：拆开自己用的系统，弄清它们怎么运转。',
    '依靠他人的文档和工具开展工作，并明确哪些是他们的、哪些是我的。',
    '每页都说明我做了什么、用了哪些工具和项目。',
  ],
};
