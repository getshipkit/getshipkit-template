/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.getshipkit.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/dashboard/**', '/api/**'],
};
