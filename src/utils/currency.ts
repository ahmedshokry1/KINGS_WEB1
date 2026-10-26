import { CurrencyCode, CurrencyConfig } from '../types/store';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EGP: {
    code: 'EGP',
    nameAr: 'جنيه مصري',
    symbol: 'ج.م',
    rateToEGP: 1, // Base currency
  },
  SAR: {
    code: 'SAR',
    nameAr: 'ريال سعودي',
    symbol: 'ر.س',
    rateToEGP: 13.5, // 1 SAR ~ 13.5 EGP
  },
  AED: {
    code: 'AED',
    nameAr: 'درهم إماراتي',
    symbol: 'د.إ',
    rateToEGP: 13.75, // 1 AED ~ 13.75 EGP
  },
  USD: {
    code: 'USD',
    nameAr: 'دولار أمريكي',
    symbol: '$',
    rateToEGP: 50.0, // 1 USD ~ 50 EGP
  },
};

export function convertFromEGP(amountEGP: number, targetCurrency: CurrencyCode): number {
  if (targetCurrency === 'EGP') return amountEGP;
  const rate = CURRENCIES[targetCurrency].rateToEGP;
  const converted = amountEGP / rate;
  // Round nicely
  if (targetCurrency === 'USD') {
    return Math.round(converted * 10) / 10;
  }
  return Math.round(converted);
}

export function formatPrice(amountEGP: number, currency: CurrencyCode): string {
  const converted = convertFromEGP(amountEGP, currency);
  const cfg = CURRENCIES[currency];
  
  if (currency === 'USD') {
    return `$${converted.toFixed(converted % 1 === 0 ? 0 : 2)}`;
  }
  return `${converted.toLocaleString('ar-EG')} ${cfg.symbol}`;
}
