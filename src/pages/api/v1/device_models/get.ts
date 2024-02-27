import { routes } from "@seamapi/types/devicedb"
import { NotFoundException } from "nextlove"

import { getBaseUrl } from "lib/get-base-url.ts"
import { withRouteSpec } from "lib/middleware/index.ts"
import { publicMapDeviceModel } from "lib/public-mappings/device-model.ts"

export default withRouteSpec({
  ...routes["/api/v1/device_models/get"],
  auth: "vercel_protection_bypass_secret",
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

  const fake_devicedb_base_url = getBaseUrl(req)

  res.status(200).json({
    device_model: publicMapDeviceModel({
      device_model,
      manufacturer,
      fake_devicedb_base_url,
      db: req.db,
    }),
  })
})
