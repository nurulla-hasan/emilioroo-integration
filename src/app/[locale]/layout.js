import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import GlobalAudioPlayer from '@/components/common/GlobalAudioPlayer';


export default async function LngLayout({ children, params }) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        return notFound()
    }
    return (
        <div lang={locale}>
            <NextIntlClientProvider>
                {children}
            </NextIntlClientProvider>
            <GlobalAudioPlayer />
        </div>
    );
}