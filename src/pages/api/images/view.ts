import axios from "axios"
import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { seam_logo } from "lib/seam_logo.ts"

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

  const { status, headers, data } = await axios.get(
    external_image_proxy_endpoint,
    {
      params: {
        image_id,
      },
      responseType: "arraybuffer",
      validateStatus: () => true,
    },
  )

  res.status(status)

  if (headers["cache-control"]) {
    res.setHeader("cache-control", headers["cache-control"] as string)
  }

  if (headers["content-type"]) {
    res.setHeader("content-type", headers["content-type"] as string)
  }

  res.end(data)
})
