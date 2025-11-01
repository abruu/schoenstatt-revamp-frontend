/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sla.schoenstatt-fathers.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/about'),
    await config.transform(config, '/register'),
    await config.transform(config, '/b2-exam'),
    await config.transform(config, '/events'),
    await config.transform(config, '/gallery'),
    await config.transform(config, '/graduates'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    additionalSitemaps: [
      'https://sla.schoenstatt-fathers.in/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    const priority = {
      '/': 1.0,
      '/register': 0.9,
      '/b2-exam': 0.8,
      '/about': 0.7,
      '/events': 0.6,
      '/gallery': 0.5,
      '/graduates': 0.5,
    }

    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: priority[path] || 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
