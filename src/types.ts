export interface GuestItem {
  id: string;
  name: string;
  roleType: 'expert' | 'guest'; // 'expert' -> 特邀专家 (with cyan-mint subtle border), 'guest' -> 特邀嘉宾
  roleLabel: string;
  title: string;
  organization: string | string[];
  bio: string;
  avatarText?: string;
  avatarBg?: string;
  avatarUrl?: string;
}

export interface AgendaSubItem {
  title: string;
  duration: string;
  speaker?: string;
}

export interface AgendaItem {
  id: string;
  timeRange?: string;
  duration: string;
  title: string;
  speaker?: string;
  speakerTitle?: string;
  subItems?: AgendaSubItem[];
  isHighlight?: boolean;
}

export interface RsvpFormData {
  companyName: string;
  attendeeName: string;
  attendeeCount: number | '';
  phone: string;
  remark: string;
  submittedAt?: string;
  ticketCode?: string;
}

export interface ConferenceConfig {
  theme: {
    title: string;
    subTitle: string;
    dateText: string;
    timeText?: string;
    venueText: string;
    venueDetail: string;
    address: string;
    mapUrl: string;
    latitude: number;
    longitude: number;
    organizer: string;
    coOrganizer: string;
    contactName: string;
    contactPhone: string;
    contactPhoneTel: string;
  };
  styleTokens: {
    bgGradientTop: string;
    bgGradientBottom: string;
    primaryBlue: string;
    primaryMint: string;
    textDark: string;
    textMedium: string;
    textLight: string;
    cardBg: string;
    borderColor: string;
  };
  invitationText: string;
  introText: string;
  introBannerUrl?: string;
  introTags: string[];
  guests: GuestItem[];
  agenda: AgendaItem[];
  api: {
    rsvpSubmitUrl: string; // 预留 POST 接口地址
    enableLocalStorageBackup: boolean;
    autoRetryOnLoad: boolean;
  };
  shareMeta: {
    title: string;
    desc: string;
    link: string;
  };
}
