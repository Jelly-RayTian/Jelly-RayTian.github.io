import type { Lang } from '../../i18n/ui';

/** Page-level copy (headings and intros). Section content lives in content.json and the Markdown collections. */
export const pages: Record<Lang, Record<string, { k: string; h: string; p: string }>> = {
  en: {
    about: { k: 'About', h: 'A person, <em>not just a repo list.</em>', p: 'Engineering is one part of how I work. The rest is organizing people, helping classmates, making things and staying curious.' },
    education: { k: 'Education & achievements', h: 'Where I <em>study.</em>', p: 'University of Waterloo and a British Columbia–curriculum high school in Shanghai.' },
    experience: { k: 'Experience & leadership', h: 'Starting things, <em>helping them last.</em>', p: 'Groups and projects I started or ran in high school.' },
    projects: { k: 'Software projects', h: 'Things I <em>built.</em>', p: 'Independent projects and course concepts.' },
    openSource: { k: 'Open-source contributions', h: 'Before, after, <em>and the receipts.</em>', p: 'Every pull request I have sent to other people\'s projects, checked against GitHub and each project\'s main history.' },
    volunteering: { k: 'Volunteering & community', h: 'Showing up <em>for neighbours.</em>', p: 'Community and peer-support activities.' },
    systems: { k: 'Reverse engineering & systems exploration', h: 'Taking things apart <em>to see how they work.</em>', p: 'Hands-on experiments from high school: game resource files, Android devices and iOS. Self-taught, driven by curiosity.' },
    creative: { k: 'Digital content & creative work', h: 'Making things <em>people watch.</em>', p: 'A video channel with game experiments, modification effects and other creative videos, plus a short-film project.' },
    contact: { k: 'Contact', h: 'Let\'s <em>talk.</em>', p: 'I keep personal email and phone off this public site. Message me on LinkedIn or open an issue on GitHub; I share contact details in applications.' },
  },
  zh: {
    about: { k: '关于我', h: '不只是一份<em>仓库清单。</em>', p: '工程只是我做事的一部分。另一部分是组织同伴、帮助同学、动手创作，以及保持好奇。' },
    education: { k: '教育与成就', h: '我在<em>哪里学习。</em>', p: '滑铁卢大学，以及上海的一所 BC 课程体系高中。' },
    experience: { k: '经历与领导力', h: '发起事情，<em>并让它延续。</em>', p: '我在高中阶段发起或组织的小组和项目。' },
    projects: { k: '软件项目', h: '我<em>做的东西。</em>', p: '独立项目与课程概念。' },
    openSource: { k: '开源贡献', h: '修复前、修复后，<em>附上凭证。</em>', p: '我提交给他人项目的每一个 pull request，已对照 GitHub 和各项目 main 的历史核实。' },
    volunteering: { k: '志愿服务与社区', h: '为身边的人<em>出一份力。</em>', p: '社区与同伴互助活动。' },
    systems: { k: '逆向工程与系统探索', h: '拆开看看，<em>它是怎么运转的。</em>', p: '高中阶段的动手实验：游戏资源文件、Android 设备和 iOS。出于好奇自学。' },
    creative: { k: '数字内容与创作', h: '做出来，<em>给大家看。</em>', p: '一个发布游戏实验、修改效果和其他创作视频的账号，以及一个短片项目。' },
    contact: { k: '联系', h: '欢迎<em>交流。</em>', p: '公开网站不放个人邮箱和电话。可以通过 LinkedIn 联系我，或在 GitHub 上留言；申请材料中会提供联系方式。' },
  },
};

export const home = {
  en: {
    kicker: 'University of Waterloo · Honours Mathematics (Co-op) · Started September 2026',
    tag: ['Reproduce', ' the bug. ', 'Patch', ' it. ', 'Prove', ' it stays fixed.'],
    interests: 'Business analysis · Data analytics · Technology',
    lede: 'Honours Mathematics Co-op student at the University of Waterloo, interested in data-driven problem solving, product development, and technology-enabled business solutions.',
    seeking: 'Seeking Co-op Opportunities in Business Analysis, Data Analytics & Technology',
    projectsP: 'Each one starts from a real need, and says how I checked the result and what exists today.',
    ctaProjects: 'Featured projects',
    watdesk: [['Need', 'Waterloo deadlines, exams and grades are spread across LEARN, Crowdmark and Odyssey.'], ['Built', 'One side panel with a timeline, a two-week workload view, exam countdowns, grades and calendar export; English and Simplified Chinese.'], ['Verified', 'At v1.9.0, CI ran type checks, a production build and 284 passing tests; 8 tagged releases.'], ['Status', 'Edge Add-ons listing under review; install from GitHub releases. Data stays in the browser.']],
    ossIntro: 'I reproduce a bug, fix it with tests, and answer the maintainer. Three examples, with before and after:',
    aiNote: 'WatDesk and most of my open-source fixes were developed with AI coding assistants. I define the problem, review every diff, run the tests and talk to maintainers; I did not hand-write all of the code.',
    skillsP: 'Grouped by how I actually use each skill. Items marked learning or introductory are not claims of proficiency.',
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
    tag: ['复现', '问题。', '修补', '它。', '证明', '它不再复发。'],
    interests: '商业分析 · 数据分析 · 技术',
    lede: '滑铁卢大学数学荣誉学士（Co-op）学生，关注数据驱动的问题解决、产品开发，以及由技术支撑的商业解决方案。',
    seeking: '寻求商业分析、数据分析与技术方向的 Co-op 机会',
    projectsP: '每个项目都从真实需求出发，并说明我如何核对结果、现在做到了什么程度。',
    ctaProjects: '重点项目',
    watdesk: [['需求', '滑铁卢的截止日期、考试和成绩分散在 LEARN、Crowdmark 和 Odyssey 里。'], ['做了什么', '一个侧边栏：时间线、两周工作量视图、考试倒计时、成绩和日历导出；支持英文和简体中文。'], ['验证', 'v1.9.0 时 CI 运行类型检查、生产构建和 284 个通过的测试；共 8 个版本。'], ['现状', 'Edge 商店上架审核中；可从 GitHub releases 安装。数据留在浏览器里。']],
    ossIntro: '我复现 bug、带测试修复，并回应维护者。三个例子，附修复前后对比：',
    aiNote: 'WatDesk 和我大部分开源修复都借助 AI 编程助手完成。我负责界定问题、审查每一处 diff、运行测试并与维护者沟通；并非所有代码都由我手写。',
    skillsP: '按我实际使用的方式分组。标注“学习中”或“入门”的项目不代表熟练。',
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
