import i18n from '@/i18n';

export type TranslatableField = string | Record<string, string> | null | undefined;

/**
 * Resolves a Spatie translatable field based on current i18n language.
 * Falls back to 'en', then first available key, or original string.
 */
export function getTranslated(field: TranslatableField, fallback: string = ''): string {
    if (!field) return fallback;

    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            if (typeof parsed === 'object' && parsed !== null) {
                return getTranslated(parsed, fallback);
            }
        } catch {
            return field;
        }
        return field;
    }

    if (typeof field === 'object') {
        const lang = i18n.language?.split('-')[0] || 'en';
        if (field[lang]) return field[lang];
        if (field['en']) return field['en'];
        const firstKey = Object.keys(field)[0];
        if (firstKey && field[firstKey]) return field[firstKey];
    }

    return fallback;
}
