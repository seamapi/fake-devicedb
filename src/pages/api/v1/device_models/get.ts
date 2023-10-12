import { routes } from "@seamapi/types/devicedb"
import { NotFoundException } from "nextlove"

import { withRouteSpec } from "lib/middleware/index.ts"
import { publicMapDeviceModelV1 } from "lib/public-mappings/device-model-v1.ts"

export default withRouteSpec({
  ...routes["/api/v1/device_models/get"],
  auth: "vercel_protection_secret",
} as const)(async (req, res) => {
  const device_model = req.db.device_models.find(
    (model) => model.device_model_id === req.query.device_model_id,
  )

  if (!device_model) {
    throw new NotFoundException({
      type: "device_model_not_found",
      message: "Device model not found",
    })
  }

  const manufacturer = req.db.manufacturers.find(
    (m) => m.manufacturer_id === device_model.manufacturer_id,
  )

  if (!manufacturer) {
    throw new Error(
      `Manufacturer for device model ${device_model.device_model_id} cannot be found`,
    )
  }

  const x_forwarded_seam_base_url = req.headers["x-forwarded-seam-base-url"] as
    | string
    | undefined

  res.status(200).json({
    device_model: publicMapDeviceModelV1({
      device_model,
      manufacturer,
      fake_devicedb_endpoint: `http://${req.headers.host}`,
      live_seam_connect_endpoint:
        req.db.live_seam_connect_endpoint ?? undefined,
      x_forwarded_seam_base_url,
    }),
  })
})
