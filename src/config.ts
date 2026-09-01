import { ConferenceConfig } from './types';

/**
 * 集中式配置对象 (Centralized Configuration)
 * 非技术人员可在此直接修改会议信息、文案、嘉宾、议程、颜色主题与接口地址
 */
export const INVITATION_CONFIG: ConferenceConfig = {
  theme: {
    title: '智赋文旅・数启新局',
    subTitle: '酒店场景 AI 智能体创新实践交流大会',
    dateText: '2026年9月11日（周五）14:30—17:30',
    venueText: '贵阳东景希尔顿酒店',
    venueDetail: 'B2 贵阳宴会厅 1',
    address: '贵州省贵阳市观山湖区金阳北路 277 号，贵阳东景希尔顿酒店 ——B2 贵阳宴会厅 1',
    mapUrl: 'https://apis.map.qq.com/uri/v1/marker?marker=coord:26.6348,106.6318;title:贵阳东景希尔顿酒店;addr:贵阳市观山湖区金阳北路277号',
    latitude: 26.6348,
    longitude: 106.6318,
    organizer: '贵旅数网科技有限公司',
    coOrganizer: '云码通数据运营股份有限公司',
    contactName: 'XXX',
    contactPhone: 'XXX',
    contactPhoneTel: 'XXX',
  },

  styleTokens: {
    bgGradientTop: '#DFF4FF',     // 低饱和天水蓝
    bgGradientBottom: '#E3F7EF',  // 薄荷青
    primaryBlue: '#4A90E2',       // 清透蓝
    primaryMint: '#56C596',       // 薄荷绿
    textDark: '#1F2933',          // 主标题深灰
    textMedium: '#6B7280',        // 正文/次要中灰
    textLight: '#9CA3AF',         // 辅助说明浅灰
    cardBg: '#FFFFFF',            // 卡片纯白
    borderColor: '#F0F2F5',       // 极浅灰边框
  },

  invitationText: '衷心邀请您莅临本次智赋文旅・数启新局 — 文旅场景 AI 智能体创新实践交流大会，期盼与您相聚贵阳，共探 AI 赋能文旅产业的实践路径，携手开启文旅数字化崭新格局。',

  introText: '当前 AI 技术加速赋能文旅产业变革，为酒店带来全新发展机遇。本次大会聚焦文旅 AI 落地实践，邀请行业领导、协会、酒店、合作伙伴及媒体齐聚现场，分享行业前沿观点，发布酒店智能体核心方案，与各位嘉宾共探产业升级新机遇。',

  introBannerUrl: 'https://i.mji.rip/2026/08/31/79a1ed72fa77a878d2b088f57755235d.md.png',

  introTags: [
    'AI 智能体落地',
    '酒店场景智能化',
    '文旅数字化新基建',
    'B/C 端双轮驱动',
  ],

  guests: [
    {
      id: 'guest-1',
      name: '李斌',
      roleType: 'expert',
      roleLabel: '特邀专家',
      title: '特邀专家',
      organization: '贵州省住宿业协会',
      bio: '主导文旅产业数字化转型与数字生态战略部署，引领智慧文旅多场景创新实践。',
      avatarBg: '#EBF7FF',
    },
    {
      id: 'guest-2',
      name: '张明远 博士',
      roleType: 'expert',
      roleLabel: '特邀专家',
      title: '首席 AI 架构科学家',
      organization: '人工智能协会',
      bio: '深耕大模型与垂直智能体在文旅、酒旅服务场景的工程化落地与认知交互演化。',
      avatarBg: '#EDFAF4',
    },
    {
      id: 'guest-3',
      name: '陈清华',
      roleType: 'guest',
      roleLabel: '特邀嘉宾',
      title: '中国饭店协会高级顾问',
      organization: 'XXXX',
      bio: '二十年奢华酒店运营及智慧中台架构经验，洞悉酒店降本增效与数字化体验升级。',
      avatarBg: '#F0F7FE',
    },
    {
      id: 'guest-4',
      name: '李雅琳',
      roleType: 'guest',
      roleLabel: '特邀嘉宾',
      title: '副总裁 / 数字化运营负责人',
      organization: 'XXXX',
      bio: '专注文旅场景线上线下一体化流量运营与多模态 AI 导览互动体系构建。',
      avatarBg: '#F3FBF7',
    },
  ],

  agenda: [
    {
      id: 'agenda-1',
      duration: '5 分钟',
      title: '主持人开场并介绍到场嘉宾',
    },
    {
      id: 'agenda-2',
      duration: '5 分钟',
      title: '贵旅集团领导致辞',
      isHighlight: true,
    },
    {
      id: 'agenda-3',
      duration: '30 分钟',
      title: '专家主题演讲',
      subItems: [
        {
          title: '酒店行业现实困境与转型破局之路',
          duration: '15 分钟',
        },
        {
          title: 'AI 技术浪潮：全社会变革与文旅酒店行业能力边界',
          duration: '15 分钟',
        },
      ],
    },
    {
      id: 'agenda-4',
      duration: '40 分钟',
      title: '酒店智能体全量解决方案发布',
      isHighlight: true,
      subItems: [
        {
          title: 'AI 伴侣 —— 面向住客全流程 C 端产品方案',
          duration: '20 分钟',
        },
        {
          title: '员工 AI 助手 —— 面向酒店内部员工 B 端产品方案',
          duration: '10 分钟',
        },
        {
          title: '老板端掌上 AI —— 服务酒店老板经营决策产品方案',
          duration: '10 分钟',
        },
      ],
    },
    {
      id: 'agenda-5',
      duration: '10 分钟',
      title: '合作签约仪式',
    },
    {
      id: 'agenda-6',
      duration: '40 分钟',
      title: '圆桌座谈',
    },
  ],

  api: {
    rsvpSubmitUrl: '/api/rsvp/submit', // 预留后端接收地址
    enableLocalStorageBackup: true,
    autoRetryOnLoad: true,
  },

  shareMeta: {
    title: '智赋文旅・数启新局 — 酒店场景 AI 智能体创新实践交流大会',
    desc: '诚挚邀请您莅临贵阳东景希尔顿酒店，共探 AI 赋能文旅产业落地新局。',
    link: window.location.href,
  },
};
