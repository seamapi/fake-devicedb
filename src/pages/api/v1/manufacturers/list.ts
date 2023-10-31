import { routes } from "@seamapi/types/devicedb"
import * as liqe from "liqe"
import { BadRequestException } from "nextlove"

import { getBaseUrl } from "lib/get-base-url.ts"
import { withRouteSpec } from "lib/middleware/index.ts"
import { publicMapManufacturer } from "lib/public-mappings/manufacturer.ts"

export default withRouteSpec({
  ...routes["/api/v1/manufacturers/list"],
  methods: ["GET", "POST", "OPTIONS"],
  auth: "vercel_protection_bypass_secret",
} as const)(async (req, res) => {
  let filtered_manufacturers = [...req.db.manufacturers]

  if (req.query.integration_status) {
    filtered_manufacturers = filtered_manufacturers.filter(
      (manufacturer) =>
        manufacturer.integration === req.query.integration_status,
    )
  }

  if (req.query.liqe_query) {
    try {
      filtered_manufacturers = liqe.filter(
        liqe.parse(req.query.liqe_query),
        filtered_manufacturers,
      ) as typeof filtered_manufacturers
    } catch (error) {
      if (error instanceof liqe.SyntaxError) {
        throw new BadRequestException({
          type: "liqe_syntax_error",
          message: error.message,
        })
      }

      throw error
    }
  }

  const fake_devicedb_base_url = getBaseUrl(req)

  res.status(200).json({
    manufacturers: filtered_manufacturers.map((manufacturer) => {
      return publicMapManufacturer({
        manufacturer,
        fake_devicedb_base_url,
        db: req.db,
      })
    }),
  })
})
