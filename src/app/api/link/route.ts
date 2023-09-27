import axios from "axios"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const href = url.searchParams.get('url')

  if (!href) {
    return new Response('Invalid href', { status: 400})
  }

  const res = await axios.get(href)

  const tittleMatch = res.data.match(/<title>(.*?)<\/title>/)
  const title = tittleMatch ? tittleMatch[1] : ''

  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)"/
  )
  const description = descriptionMatch ? descriptionMatch[1] : ''

  const imgMatch = res.data.match(/<meta propery="og:image" content"(.*?)"/)
  const imgUrl = imgMatch ? imgMatch[1] : ''

  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imgUrl,
        }
      }
    })
  )

}