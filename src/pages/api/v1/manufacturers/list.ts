import { routes } from "@seamapi/types/devicedb"
import * as liqe from "liqe"
import { BadRequestException } from "nextlove"

import { getBaseUrl } from "lib/get-base-url.ts"
import { withRouteSpec } from "lib/middleware/index.ts"
import type { StoredManufacturer } from "lib/models.ts"
import { publicMapManufacturer } from "lib/public-mappings/manufacturer.ts"

export default withRouteSpec({
  ...routes["/api/v1/manufacturers/list"],
  methods: ["GET", "POST", "OPTIONS"],
  auth: "vercel_protection_bypass_secret",
} as const)(async (req, res) => {
  const manufacturers = filterByLiqeQuery(
    req.query.liqe_query,
    req.db.manufacturers,
  )

  const fake_devicedb_base_url = getBaseUrl(req)

  res.status(200).json({
    manufacturers: manufacturers
      .filter((manufacturer: StoredManufacturer) => {
        const { integration_status } = req.query
        if (integration_status == null) return true
        return manufacturer.integration === integration_status
      })
      .map((manufacturer: StoredManufacturer) => {
        return publicMapManufacturer({
          manufacturer,
          fake_devicedb_base_url,
          db: req.db,
        })
      }),
  })
})

const filterByLiqeQuery = <T extends any[]>(
  query: string | undefined,
  manufacturers: T,
): T => {
  try {
    if (query == null) return manufacturers
    return liqe.filter(liqe.parse(query), manufacturers) as T
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
