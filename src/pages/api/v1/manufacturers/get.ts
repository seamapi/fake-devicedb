import { routes } from "@seamapi/types/devicedb"
import { NotFoundException } from "nextlove"

import { withRouteSpec } from "lib/middleware/index.ts"
import { publicMapManufacturer } from "lib/public-mappings/manufacturer.ts"

export default withRouteSpec({
  ...routes["/api/v1/manufacturers/get"],
  methods: ["GET", "POST", "OPTIONS"],
  auth: "vercel_protection_secret",
} as const)(async (req, res) => {
  const manufacturer = req.db.manufacturers.find(
    ({ manufacturer_id }) => manufacturer_id === req.query.manufacturer_id,
  )

  if (!manufacturer) {
    throw new NotFoundException({
      type: "manufacturer_not_found",
      message: "Manufacturer not found",
    })
  }

  const x_forwarded_seam_base_url = req.headers["x-forwarded-seam-base-url"] as
    | string
    | undefined

  res.status(200).json({
    manufacturer: publicMapManufacturer({
      manufacturer,
      fake_devicedb_endpoint: `http://${req.headers.host}`,
      external_image_proxy_endpoint:
        req.db.external_image_proxy_endpoint ?? undefined,
      x_forwarded_seam_base_url,
    }),
  })
})