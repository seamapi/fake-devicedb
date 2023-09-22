import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { seam_logo } from "lib/seam_logo.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET"],
  queryParams: z.object({
    image_id: z.string().uuid(),
  }),
} as const)(async (req, res) => {
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
