export const toCurrencyInt = (value: string): number | undefined => {
    if (/^\d+$/.test(value)) return Number(value + '00');
    if (/^\d+[,.]\d$/.test(value)) return Number(value.replace(/[,.]/, '') + '0');
    if (/^\d+[,.]\d{2}$/.test(value)) return Number(value.replace(/[,.]/, ''));
    return undefined;
};
