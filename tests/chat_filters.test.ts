import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CHAT_CATEGORY_FILTERS,
  chatCategoryForChannel,
  chatCategoryForLog,
  isChatEntryVisible,
  normalizeChatCategoryFilters,
  normalizeChatView,
} from '../src/ui/chat_filters';

describe('chat filters', () => {
  it('classifies chat channels into filter categories', () => {
    expect(chatCategoryForChannel('say')).toBe('local');
    expect(chatCategoryForChannel('yell')).toBe('local');
    expect(chatCategoryForChannel('emote')).toBe('local');
    expect(chatCategoryForChannel('general')).toBe('global');
    expect(chatCategoryForChannel('whisper')).toBe('whisper');
    expect(chatCategoryForChannel('party')).toBe('social');
    expect(chatCategoryForChannel('guild')).toBe('social');
    expect(chatCategoryForChannel('officer')).toBe('social');
  });

  it('uses explicit log metadata for presence messages', () => {
    expect(chatCategoryForLog('presence')).toBe('presence');
    expect(chatCategoryForLog('system')).toBe('system');
    expect(chatCategoryForLog(undefined)).toBe('system');
  });

  it('normalizes stored views and filter toggles defensively', () => {
    expect(normalizeChatView('whisper')).toBe('whisper');
    expect(normalizeChatView('combat')).toBe('all');
    expect(normalizeChatView(null)).toBe('all');

    expect(normalizeChatCategoryFilters({ local: false, presence: false, global: 'nope' })).toEqual({
      ...DEFAULT_CHAT_CATEGORY_FILTERS,
      local: false,
      presence: false,
    });
    expect(normalizeChatCategoryFilters('corrupt')).toEqual(DEFAULT_CHAT_CATEGORY_FILTERS);
  });

  it('applies all-tab toggles while fixed tabs show their category groups', () => {
    const filters = { ...DEFAULT_CHAT_CATEGORY_FILTERS, presence: false, social: false };

    expect(isChatEntryVisible('presence', 'all', filters)).toBe(false);
    expect(isChatEntryVisible('social', 'all', filters)).toBe(false);
    expect(isChatEntryVisible('local', 'local', filters)).toBe(true);
    expect(isChatEntryVisible('global', 'local', filters)).toBe(false);
    expect(isChatEntryVisible('presence', 'system', filters)).toBe(true);
    expect(isChatEntryVisible('system', 'system', filters)).toBe(true);
  });
});
