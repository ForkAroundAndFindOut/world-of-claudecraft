import type { SimEvent } from '../sim/types';

export type ChatChannel = NonNullable<Extract<SimEvent, { type: 'chat' }>['channel']>;
export type ChatCategory = 'local' | 'global' | 'whisper' | 'social' | 'system' | 'presence';
export type ChatView = 'all' | 'local' | 'global' | 'whisper' | 'system';
export type ChatCategoryFilters = Record<ChatCategory, boolean>;

export const CHAT_FILTER_CATEGORIES: ChatCategory[] = ['local', 'global', 'whisper', 'social', 'system', 'presence'];
export const CHAT_CATEGORY_LABELS: Record<ChatCategory, string> = {
  local: 'Local',
  global: 'Global',
  whisper: 'Whispers',
  social: 'Social',
  system: 'System',
  presence: 'Presence',
};
export const DEFAULT_CHAT_CATEGORY_FILTERS: ChatCategoryFilters = {
  local: true,
  global: true,
  whisper: true,
  social: true,
  system: true,
  presence: true,
};

const CHAT_VIEWS: ChatView[] = ['all', 'local', 'global', 'whisper', 'system'];

export function chatCategoryForChannel(channel: ChatChannel): ChatCategory {
  switch (channel) {
    case 'general': return 'global';
    case 'whisper': return 'whisper';
    case 'party':
    case 'guild':
    case 'officer':
      return 'social';
    case 'say':
    case 'yell':
    case 'emote':
    default:
      return 'local';
  }
}

export function chatCategoryForLog(category: Extract<SimEvent, { type: 'log' }>['category'] | undefined): ChatCategory {
  return category === 'presence' ? 'presence' : 'system';
}

export function normalizeChatView(value: unknown): ChatView {
  return typeof value === 'string' && (CHAT_VIEWS as string[]).includes(value) ? value as ChatView : 'all';
}

export function normalizeChatCategoryFilters(value: unknown): ChatCategoryFilters {
  const filters: ChatCategoryFilters = { ...DEFAULT_CHAT_CATEGORY_FILTERS };
  if (!value || typeof value !== 'object') return filters;
  const raw = value as Partial<Record<ChatCategory, unknown>>;
  for (const category of CHAT_FILTER_CATEGORIES) {
    if (typeof raw[category] === 'boolean') filters[category] = raw[category];
  }
  return filters;
}

export function isChatEntryVisible(category: ChatCategory, view: ChatView, filters: ChatCategoryFilters): boolean {
  switch (view) {
    case 'all': return filters[category];
    case 'system': return category === 'system' || category === 'presence';
    default: return category === view;
  }
}
