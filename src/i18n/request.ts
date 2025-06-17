import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';

const locales = ['en', 'fr', 'ar'];

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested)
    ? requested
    : 'en'; // defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
