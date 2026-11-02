// Personal content for the portfolio. English (en) and Chinese (zh) must stay in sync.
// Everything here is public. Wording is deliberately conservative: no invented titles,
// organisations, hours, dates or amounts. Internal audit notes and unpublished candidate
// items are kept outside this repository.
const CONTENT = {
  sections: {
    about: {
      en: {k: "About", h: "A person, <em>not just a repo list.</em>", p: "Engineering is one part of how I work. The rest is organizing people, helping classmates, making things and staying curious."},
      zh: {k: "关于我", h: "不只是一份<em>仓库清单。</em>", p: "工程只是我做事的一部分。另一部分是组织同伴、帮助同学、动手创作，以及保持好奇。"}
    },
    education: {
      en: {k: "Education", h: "Where I <em>study.</em>", p: "University of Waterloo and a British Columbia–curriculum high school in Shanghai."},
      zh: {k: "教育背景", h: "我在<em>哪里学习。</em>", p: "滑铁卢大学，以及上海的一所 BC 课程体系高中。"}
    },
    leadership: {
      en: {k: "Experience & leadership", h: "Starting things, <em>helping them last.</em>", p: "Self-reported activities from high school. I describe what I did and nothing beyond it: none of these were paid or official roles."},
      zh: {k: "经历与领导力", h: "发起事情，<em>并让它延续。</em>", p: "来自高中阶段的自述经历。只写我做过的事，不夸大：这些都不是带薪或正式职务。"}
    },
    community: {
      en: {k: "Volunteering & community", h: "Showing up <em>for neighbours.</em>", p: "Community and peer-support activities, described plainly."},
      zh: {k: "志愿服务与社区", h: "为身边的人<em>出一份力。</em>", p: "社区与同伴互助活动，如实描述。"}
    },
    research: {
      en: {k: "Research & creative work", h: "Ideas, <em>stories, presentations.</em>", p: "Course and independent work. It sits below my engineering work in weight, but it shows how I think and communicate."},
      zh: {k: "研究与创作", h: "想法、<em>故事与展示。</em>", p: "课程与自发的研究、创作。分量上低于我的工程工作，但能体现我如何思考和表达。"}
    },
    creative: {
      en: {k: "Content creation", h: "Making things <em>people watch.</em>", p: "A long-running video channel about games and technical experiments. The numbers are account-wide snapshots, not the results of any one video."},
      zh: {k: "内容创作", h: "做出来，<em>给大家看。</em>", p: "一个长期更新的游戏与技术实验视频账号。数字为账号整体的快照，不代表任何单个视频的成绩。"}
    },
    course: {
      en: {k: "Coursework concepts", h: "Business ideas from <em>class.</em>", p: "Team concepts written for courses. They are coursework, not launched products or companies."},
      zh: {k: "课程概念项目", h: "课堂里的<em>商业构想。</em>", p: "为课程完成的团队构想。属于课程作业，不是已上线的产品或公司。"}
    },
    achievements: {
      en: {k: "Honours & qualifications", h: "What I can <em>point to.</em>", p: "A contest score and a music level. No rankings, medals or scholarships are claimed."},
      zh: {k: "荣誉与资格", h: "可以<em>拿出来的成绩。</em>", p: "一项竞赛成绩和一项音乐等级。不声称任何排名、奖牌或奖学金。"}
    },
    resume: {
      en: {k: "Résumé", h: "The one-page <em>résumé.</em>", p: "The same facts, condensed for co-op applications. The PDF is plain text and ATS-friendly."},
      zh: {k: "简历", h: "一页<em>简历。</em>", p: "同样的事实，为 Co-op 申请精简。PDF 为纯文本，ATS 友好。"}
    },
    contact: {
      en: {k: "Contact", h: "Let's <em>talk.</em>", p: "I keep personal email and phone off this public page. Message me on LinkedIn or open an issue on GitHub; I will share contact details in applications."},
      zh: {k: "联系", h: "欢迎<em>交流。</em>", p: "公开页面不放个人邮箱和电话。可以通过 LinkedIn 联系我，或在 GitHub 上留言；申请材料中会提供联系方式。"}
    }
  },

  about: {
    en: "I'm Ray Tian, a first-year Honours Mathematics (Co-op) student at the University of Waterloo. I'm interested in software engineering, data science and quantitative development. I like problems that start from something concrete: a bug I can reproduce, a tool classmates actually need, a group that needs organizing. Away from the keyboard I play table tennis and piano, follow open-source projects, and enjoy rhythm games and interactive digital experiences.",
    zh: "我是 Ray Tian，滑铁卢大学数学荣誉学士（Co-op）大一学生，对软件工程、数据科学和量化开发感兴趣。我喜欢从具体问题出发：一个可以复现的 bug、同学真正需要的工具、一个需要有人组织的小组。离开键盘，我打乒乓球、弹钢琴，关注开源项目，也喜欢节奏游戏和互动式数字体验。"
  },
  interests: [
    {en: "Table tennis", zh: "乒乓球"},
    {en: "Piano / music", zh: "钢琴 / 音乐"},
    {en: "Open-source software", zh: "开源软件"},
    {en: "Applied mathematics", zh: "应用数学"},
    {en: "Data science", zh: "数据科学"},
    {en: "Programming and technology", zh: "编程与技术"},
    {en: "Rhythm games (osu!mania)", zh: "节奏游戏（osu!mania）"},
    {en: "Interactive games and digital experiences", zh: "互动游戏与数字体验"}
  ],

  education: [
    {
      id: "uwaterloo",
      en: {org: "University of Waterloo", place: "Waterloo, Ontario, Canada", degree: "Honours Bachelor of Mathematics, Co-operative Program", date: "Sep 2026 – Present",
           coursework: ["CS 135 — Designing Functional Programs", "MATH 135 — Algebra", "MATH 137 — Calculus 1", "ECON 101 — Introduction to Microeconomics"]},
      zh: {org: "滑铁卢大学（University of Waterloo）", place: "加拿大安大略省滑铁卢", degree: "数学荣誉学士，Co-op 项目", date: "2026 年 9 月 – 至今",
           coursework: ["CS 135 — 函数式程序设计（Designing Functional Programs）", "MATH 135 — 代数（Algebra）", "MATH 137 — 微积分 1（Calculus 1）", "ECON 101 — 微观经济学导论"]}
    },
    {
      id: "nanyang",
      en: {org: "Shanghai Nanyang Model Private High School", place: "Shanghai, China", degree: "British Columbia Curriculum", date: "Graduated 2026",
           detail: "Academic average: approximately 93.3%",
           coursework: ["Calculus 12", "Statistics 12", "Computer Science 12", "Physics 12", "Economics 12", "English Studies 12"],
           resumeCoursework: ["Calculus 12", "Statistics 12", "Computer Science 12"]},
      zh: {org: "上海南洋模范私立高中（Shanghai Nanyang Model Private High School）", place: "中国上海", degree: "BC 课程体系", date: "2026 年毕业",
           detail: "学业均分：约 93.3%",
           coursework: ["Calculus 12", "Statistics 12", "Computer Science 12", "Physics 12", "Economics 12", "English Studies 12"],
           resumeCoursework: ["Calculus 12", "Statistics 12", "Computer Science 12"]}
    }
  ],

  // Honest skill tiers. Nothing here is a claim of proficiency beyond what the tier says.
  skills: [
    {label: {en: "Coursework", zh: "课程学习"},
     items: {en: "Racket (CS 135)", zh: "Racket（CS 135）"}},
    {label: {en: "Project use", zh: "项目使用"},
     items: {en: "TypeScript, JavaScript, React, Vite, Vitest (WatDesk); Git and GitHub collaboration", zh: "TypeScript、JavaScript、React、Vite、Vitest（WatDesk）；Git 与 GitHub 协作"}},
    {label: {en: "Limited exposure", zh: "有限接触"},
     items: {en: "C, Swift, Rust, Python (open-source pull requests and personal projects, with AI coding assistance)", zh: "C、Swift、Rust、Python（开源 PR 与个人项目，借助 AI 编程助手）"}},
    {label: {en: "Introductory", zh: "入门"},
     items: {en: "SQL", zh: "SQL"}},
    {label: {en: "Practices", zh: "实践方法"},
     items: {en: "Regression testing, GitHub Actions, ASan/UBSan (used in Madeira PRs), time-zone handling", zh: "回归测试、GitHub Actions、ASan/UBSan（用于 Madeira PR）、时区处理"}}
  ],
  languages: {
    en: "Mandarin Chinese — Native · English — IELTS Academic Overall Band 7.0",
    zh: "中文 — 母语 · 英语 — IELTS Academic 总分 7.0"
  },

  // Bilibili account. Account-wide totals; values are snapshots and will drift.
  creative: {
    profile: "https://space.bilibili.com/597194489",
    stats: [
      {value: "1,720", label: {en: "followers", zh: "粉丝"}, src: {en: "public profile query, 2026-11-02", zh: "公开主页查询，2026-11-02"}},
      {value: "57,522", label: {en: "total likes", zh: "累计获赞"}, src: {en: "public profile query, 2026-11-02", zh: "公开主页查询，2026-11-02"}},
      {value: "2.999M", label: {en: "total plays", zh: "累计播放"}, src: {en: "profile screenshot supplied by me", zh: "本人提供的主页截图"}},
      {value: "816", label: {en: "uploads", zh: "投稿"}, src: {en: "profile screenshot (a public count query returned 771)", zh: "主页截图（公开计数查询为 771）"}}
    ],
    note: {
      en: "Account-wide totals across all content, not the performance of any single technical video. Snapshots only; they change over time.",
      zh: "为账号全部内容的整体数字，不是任何单个技术视频的成绩。仅为快照，会随时间变化。"
    }
  },

  // section: leadership | community | research | course | achievements
  // resume: include in the one-page PDF (en lines are the short résumé form).
  entries: [
    {id: "peer-listening", section: "leadership",
     en: {title: "Peer Listening Group", role: "Founder & Organizer", date: "High school",
          bullets: ["Started a peer listening and discussion group; membership grew from 8 to 22 over one semester.", "Organized weekly discussions and arranged guidance from a school counsellor.", "Shared supportive resources with members through WeChat."],
          note: "A peer-led student group, not a counselling role.", tags: "Initiative · Facilitation · Organizing"},
     zh: {title: "同伴倾听小组", role: "发起人与组织者", date: "高中阶段",
          bullets: ["发起同伴倾听与交流小组；一个学期内成员从 8 人增长到 22 人。", "组织每周讨论，并联系学校辅导员提供指导。", "通过微信向成员分享相关支持资源。"],
          note: "由学生发起的同伴小组，并非心理咨询工作。", tags: "主动发起 · 组织讨论 · 同伴支持"},
     resume: {en: ["Founded and organized a weekly peer listening group; membership grew from 8 to 22 in one semester.", "Arranged guidance from a school counsellor and shared support resources through WeChat."], title: "Peer Listening Group — Founder & Organizer", date: "High school"}},
    {id: "roommate-mediation", section: "leadership",
     en: {title: "Roommate Conflict Mediation", role: "Volunteered to help", date: "Grade 10",
          bullets: ["Stepped in on my own initiative to help roommates work through a dormitory conflict.", "Organized conversations with everyone involved and helped them agree on shared living rules."],
          tags: "Mediation · Communication"},
     zh: {title: "室友冲突协调", role: "主动协助", date: "高一（Grade 10）",
          bullets: ["主动协助室友处理宿舍里的冲突。", "组织各方沟通和讨论，并帮助大家建立共同生活约定。"],
          tags: "调解 · 沟通"}},
    {id: "literature-symposium", section: "leadership",
     en: {title: "Global Literature Symposium", role: "Discussion lead",
          bullets: ["Led a symposium discussion of Yu Hua's novel To Live (《活着》).", "Took part in analysing the text and in preparing and presenting the material."],
          tags: "Literary analysis · Presenting"},
     zh: {title: "全球文学研讨会", role: "研讨主导",
          bullets: ["主导围绕余华《活着》的文学研讨。", "参与内容分析、整理与展示。"],
          tags: "文本分析 · 展示"}},

    {id: "grocery", section: "community",
     en: {title: "Community Grocery Coordination", role: "Community volunteer", date: "2021",
          bullets: ["Collected and organized grocery needs from neighbourhood families.", "Helped coordinate supplies, donations and neighbour-to-neighbour support, assisting about 25 households over roughly two months."],
          tags: "Coordination · Community support"},
     zh: {title: "社区采购协调", role: "社区志愿者", date: "2021 年",
          bullets: ["收集并整理社区家庭的采购需求。", "协助协调物资、捐助与邻里互助，约两个月内帮助约 25 户家庭。"],
          tags: "协调 · 社区互助"},
     resume: {en: ["Collected and organized grocery needs from neighbourhood families and helped coordinate supplies and donations; assisted about 25 households over roughly two months."], title: "Community Grocery Coordination — Volunteer", date: "2021"}},
    {id: "peer-learning", section: "community",
     en: {title: "Peer Learning Support", role: "Group organizer & volunteer tutor", date: "2021 – high school",
          bullets: ["Set up a peer homework-help group in 2021; it grew from 5 to 8 members.", "Helped a classmate learn and practise English over four consecutive months."],
          tags: "Peer learning · Tutoring"},
     zh: {title: "同伴学习互助", role: "互助群组织者与志愿辅导", date: "2021 年起 · 高中阶段",
          bullets: ["2021 年建立同伴作业互助群，成员从 5 人增加到 8 人。", "连续四个月帮助一位同学学习和练习英语。"],
          tags: "同伴学习 · 辅导"},
     resume: {en: ["Organized a peer homework-help group (5 to 8 members) and tutored a classmate in English for four consecutive months."], title: "Peer Learning Support — Organizer & Volunteer Tutor", date: "2021 – high school"}},
    {id: "recycled-art", section: "community",
     en: {title: "Recycled Art Workshops", role: "Initiator & organizer",
          bullets: ["Initiated and organized community art activities using recycled materials."],
          tags: "Organizing · Creative leadership"},
     zh: {title: "回收材料艺术工作坊", role: "发起人与组织者",
          bullets: ["发起并组织使用回收材料的社区艺术活动。"],
          tags: "组织 · 创意"}},
    {id: "storytelling", section: "community",
     en: {title: "Youth Cultural Storytelling", role: "Storyteller",
          bullets: ["Told and performed myths from different cultures for young audiences."],
          tags: "Storytelling · Performance"},
     zh: {title: "青少年文化故事会", role: "讲述者与表演者",
          bullets: ["面向青少年讲述和表演不同文化中的神话故事。"],
          tags: "讲故事 · 表演"}},

    {id: "housing-advocacy", section: "research",
     en: {title: "Student Housing & Safety Advocacy", role: "Researcher & presenter",
          bullets: ["Researched housing and safety resources for international students at Canadian universities.", "Compiled the findings into an advocacy presentation of about five minutes."],
          tags: "Research · Advocacy · Presenting"},
     zh: {title: "学生住宿与安全倡议", role: "研究与展示",
          bullets: ["研究加拿大大学国际学生的住宿与安全资源。", "整理信息，制作约五分钟的倡议展示。"],
          tags: "研究 · 倡议 · 展示"}},
    {id: "game-re", section: "research",
     en: {title: "Game Reverse Engineering & Technical Exploration", role: "Independent exploration · Plants vs. Zombies 2",
          bullets: ["Explored how a mobile game works internally, using reverse-engineering tools including IDA Pro to analyse program behaviour.", "Shared experiments and demonstrations on Bilibili; not every demonstration video is an independent reverse-engineering project."],
          note: "No vendor-confirmed vulnerability, bounty or fix is claimed, and implementation details are not published.", tags: "Reverse engineering · Debugging · Technical exploration"},
     zh: {title: "游戏逆向与技术探索", role: "独立探索 · Plants vs. Zombies 2",
          bullets: ["探索一款手机游戏的内部运作，使用包括 IDA Pro 在内的逆向工具分析程序行为。", "在 Bilibili 分享实验与演示；并非每个演示视频都是独立完成的逆向项目。"],
          note: "不声称存在厂商确认的漏洞、奖励或修复；不公开实现细节。", tags: "逆向工程 · 调试 · 技术探索"}},
    {id: "film", section: "research",
     en: {title: "Multicultural Film Project", role: "Director",
          bullets: ["Directed a cross-cultural short film that blends Chinese and Indigenous mythological elements.", "Took part in storyboarding and editing."],
          note: "Production materials are not published yet.", tags: "Directing · Storyboarding · Editing"},
     zh: {title: "多元文化短片项目", role: "导演",
          bullets: ["导演一部融合中国与原住民神话元素的跨文化短片。", "参与故事板设计和剪辑。"],
          note: "制作材料暂未公开。", tags: "导演 · 分镜 · 剪辑"}},
    {id: "ai-economics", section: "research",
     en: {title: "Will Economics Determine the Future of AI?", role: "Course presentation materials",
          bullets: ["Slide deck and speaking script for a course on Bitcoin and AI.", "Covers AI investment, economic incentives, infrastructure and policy constraints."],
          tags: "Economics × technology · Argument structure"},
     zh: {title: "经济学会决定 AI 的未来吗？", role: "课程展示材料",
          bullets: ["为“比特币与 AI”课程准备的演示文稿与讲稿。", "涵盖 AI 投资、经济激励、基础设施与政策约束。"],
          tags: "经济学 × 科技 · 论证结构"}},

    {id: "easytrip", section: "course",
     en: {title: "EasyTrip", role: "E-commerce team project · three-person team", date: "2026",
          bullets: ["Marketing plan (April 27, 2026) and venture-style pitch for a student travel-planning concept.", "Covered customer groups, competition, pricing, business model and growth plans."],
          note: "A coursework concept, not a launched or funded company.", tags: "Marketing plan · Pitch"},
     zh: {title: "EasyTrip", role: "电商课程团队项目 · 三人团队", date: "2026 年",
          bullets: ["完成面向学生旅行规划概念的营销计划（2026 年 4 月 27 日）与 VC 风格路演材料。", "内容包括客户群体、竞争、定价、商业模式与增长计划。"],
          note: "课程概念，不是已上线或获得融资的公司。", tags: "营销计划 · 路演"}},
    {id: "teachflow", section: "course",
     en: {title: "TeachFlow", role: "Education technology course concept · two-person marketing plan",
          bullets: ["Marketing plan covering product positioning, education-technology context and competitive analysis."],
          note: "A coursework concept; no software was deployed.", tags: "EdTech · Positioning"},
     zh: {title: "TeachFlow", role: "教育科技课程概念 · 两人营销计划",
          bullets: ["营销计划，涵盖产品定位、教育科技背景和竞争分析。"],
          note: "课程概念，未部署任何软件。", tags: "教育科技 · 产品定位"}},

    {id: "euclid", section: "achievements",
     en: {title: "Euclid Mathematics Contest", role: "2025 · Score 83 / 100", tags: "Mathematical problem solving"},
     zh: {title: "Euclid 数学竞赛", role: "2025 年 · 成绩 83 / 100", tags: "数学问题求解"},
     resume: {en: ["Euclid Mathematics Contest, 2025: 83/100"]}},
    {id: "piano", section: "achievements",
     en: {title: "Piano Performance — Level 10", role: "Completed in primary school (Grade 4)", tags: "Music"},
     zh: {title: "钢琴演奏 — 十级", role: "小学四年级完成", tags: "音乐"},
     resume: {en: ["Piano Performance, Level 10 (completed in primary school)"], optional: true}}
  ]
};
