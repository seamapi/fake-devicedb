import axios from "axios"
import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { seam_logo } from "lib/seam_logo.ts"

export default withRouteSpec({
  auth: "vercel_protection_secret",
  methods: ["GET"],
  queryParams: z.object({
    image_id: z.string().uuid(),
    _fake_live_seam_connect_endpoint: z.string().url().optional(),
  }),
} as const)(async (req, res) => {
  const { image_id, _fake_live_seam_connect_endpoint } = req.query
  if (_fake_live_seam_connect_endpoint) {
    const { status, headers, data } = await axios.get(
      `${_fake_live_seam_connect_endpoint}/internal/devicedb_image_proxy`,
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

    return
  }

  if (req.query.image_id !== "00000000-0000-0000-0000-000000000000") {
    throw new NotFoundException({
      type: "image_not_found",
      message: "Image not found",
    })
  }

  res.setHeader("content-type", "image/png")
  res.setHeader("cache-control", "public, max-age=31536000, immutable")
  res.status(200).end(seam_logo.data)
})
