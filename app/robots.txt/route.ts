export async function GET() {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://menubase.eu/sitemap.xml`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  )
}
