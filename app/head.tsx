export default function Head() {
  return (
    <>
      {/* Preload critical assets */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      {/* Add resource hints */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Meta tags for better performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    </>
  )
}

