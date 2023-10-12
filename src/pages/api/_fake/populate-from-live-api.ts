import { z } from "zod"

import { populateFromLiveApi } from "lib/database/populate-from-live-api.ts"
import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  middlewares: [],
  jsonBody: z.object({
    device_category: z.string(),
    vercel_protection_bypass_secret: z.string(),
    device_db_endpoint: z.string().url(),
  }),
} as const)(async (req, res) => {
  const {
    vercel_protection_bypass_secret,
    device_db_endpoint,
    device_category,
  } = req.body

  await populateFromLiveApi({
    db: req.db,
    device_category: device_category as any,
    endpoint: device_db_endpoint,
    vercel_protection_bypass_secret,
  })

  res.status(200).json({})
})
