// robots.js for Next.js App Router — auto-serves /robots.txt at the edge
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://sriman-rutvik.vercel.app/sitemap.xml',
  };
}
