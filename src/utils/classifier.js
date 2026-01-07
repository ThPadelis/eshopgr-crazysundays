const CATEGORY_MAP = {
    'LPT': 'Laptops',
    'TEL': 'Telephony',
    'PC1': 'PC Systems & Peripherals',
    'TAB': 'Tablets',
    'HAP': 'Home Appliances',
    'PER': 'Peripherals',
    'PS5': 'Gaming',
    'PS4': 'Gaming',
    'NSW': 'Gaming',
    'XB1': 'Gaming',
};

export const TECH_PREFIXES = Object.keys(CATEGORY_MAP);

export const NON_TECH_KEYWORDS = [
    'MUG',
    'KEYCHAIN',
    'FIGURE',
    'PLUSH',
    'TOY',
    'T-SHIRT',
    'BAG',
    'BACKPACK',
    'BBQ',
    'GRILL',
];

export function getCategory(item) {
    if (!item.productCode) return 'Unknown';
    const prefix = item.productCode.split('.')[0];

    if (CATEGORY_MAP[prefix]) {
        if (prefix === 'PER') {
            const titleUpper = item.title.toUpperCase();
            if (NON_TECH_KEYWORDS.some((keyword) => titleUpper.includes(keyword))) {
                return 'Merchandise / Other';
            }
        }
        return CATEGORY_MAP[prefix];
    }

    return 'Other';
}

export function isTechItem(item) {
    if (!item.productCode) return false;

    const prefix = item.productCode.split('.')[0];

    if (!TECH_PREFIXES.includes(prefix)) {
        return false;
    }

    if (prefix === 'PER') {
        const titleUpper = item.title.toUpperCase();
        if (NON_TECH_KEYWORDS.some((keyword) => titleUpper.includes(keyword))) {
            return false;
        }
    }

    return true;
}
