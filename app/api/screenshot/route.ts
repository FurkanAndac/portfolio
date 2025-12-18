export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new Response("URL parameter is required", { status: 400 })
  }

  try {
    const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=8b92a961dc274a7d89760c162598cb78&wait_until=page_loaded&url=${encodeURIComponent(url)}`

    const response = await fetch(screenshotUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
      },
    })

    if (!response.ok) {
      console.error(`Screenshot service returned ${response.status}`)
      return new Response("Screenshot not available", { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Screenshot error:", error)
    return new Response("Failed to generate screenshot", { status: 404 })
  }
}
