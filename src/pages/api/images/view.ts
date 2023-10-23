import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import image from "lib/seam-logo.ts"

const forwardedHeaders = [
  "content-type",
  "etag",
  "last-modified",
  "cache-control",
]

export default withRouteSpec({
  auth: "vercel_protection_bypass_secret",
  methods: ["GET"],
  queryParams: z.object({
    image_id: z.string().uuid(),
  }),
} as const)(async (req, res) => {
  const { image_id } = req.query

  if (image_id === "00000000-0000-0000-0000-000000000000") {
    res.setHeader("content-type", "image/png")
    res.setHeader("cache-control", "public, max-age=31536000, immutable")
    res.status(200).end(image.data)
    return
  }

  const { external_image_proxy_endpoint } = req.db
  if (!external_image_proxy_endpoint) {
    throw new NotFoundException({
      type: "image_not_found",
      message: "Image not found",
    })
  }

  const url = new URL(external_image_proxy_endpoint)
  url.searchParams.set("image_id", image_id)
  const proxyRes = await fetch(url)
  const { status, headers } = proxyRes
  const data = await proxyRes.arrayBuffer()

  for (const key of forwardedHeaders) {
    if (headers.has(key)) {
      const value = headers.get(key)
      if (typeof value === "string") res.setHeader(key, value)
    }
  }

  res.status(status).end(Buffer.from(data))
})
