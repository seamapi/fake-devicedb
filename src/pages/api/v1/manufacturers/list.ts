import { routes } from "@seamapi/types/devicedb"

import { withRouteSpec } from "lib/middleware/index.ts"
import { publicMapManufacturer } from "lib/public-mappings/manufacturer.ts"

export default withRouteSpec({
  ...routes["/api/v1/manufacturers/list"],
  methods: ["GET", "POST", "OPTIONS"],
  auth: "vercel_protection_secret",
} as const)(async (req, res) => {
  let filtered_manufacturers = [...req.db.manufacturers]

  if (req.query.integration_status) {
    filtered_manufacturers = filtered_manufacturers.filter(
      (manufacturer) =>
        manufacturer.integration === req.query.integration_status,
    )
  }

  res.status(200).json({
    manufacturers: filtered_manufacturers.map((manufacturer) => {
      const x_forwarded_seam_base_url = req.headers[
        "x-forwarded-seam-base-url"
      ] as string | undefined

      return publicMapManufacturer({
        manufacturer,
        fake_devicedb_endpoint: `http://${req.headers.host}`,
        live_seam_connect_endpoint:
          req.db.live_seam_connect_endpoint ?? undefined,
        x_forwarded_seam_base_url,
      })
    }),
  })
})
