import createNextIntlPlugin from 'next-intl/plugin'; 
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['placehold.co', "d19ily4n4ue4ad.cloudfront.net", "images.unsplash.com", "avatar.iran.liara.run"],
    },
};
export default withNextIntl(nextConfig);