import { routes } from "@seamapi/types/devicedb"
import axios from "axios"
import { z } from "zod"

import { seedDatabaseFromApi } from "lib/database/index.ts"
import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  middlewares: [],
  jsonBody: z.object({
    device_category:
      routes["/api/v1/device_models/list"].queryParams.shape.main_category,
    vercel_protection_bypass_secret: z.string(),
    device_db_endpoint: z.string().url(),
  }),
} as const)(async (req, res) => {
  const {
    vercel_protection_bypass_secret,
    device_db_endpoint,
    device_category,
  } = req.body

  const client = axios.create({
    baseURL: device_db_endpoint,
    headers: {
      "x-vercel-protection-bypass": vercel_protection_bypass_secret,
    },
  })

  await seedDatabaseFromApi(req.db, client, {
    device_category,
  })

  res.status(200).json({})
})
