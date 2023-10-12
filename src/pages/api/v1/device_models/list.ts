import { routes } from "@seamapi/types/devicedb"

import { withRouteSpec } from "lib/middleware/index.ts"
import { publicMapDeviceModelV1 } from "lib/public-mappings/device-model-v1.ts"

export default withRouteSpec({
  ...routes["/api/v1/device_models/list"],
  methods: ["GET", "POST", "OPTIONS"],
  auth: "vercel_protection_secret",
} as const)(async (req, res) => {
  res.status(200).json({
    device_models: req.db.device_models.map((device_model) => {
      const manufacturer = req.db.manufacturers.find(
        (m) => m.manufacturer_id === device_model.manufacturer_id,
      )

      if (!manufacturer) {
        throw new Error(
          `Manufacturer for device model ${device_model.device_model_id} cannot be found`,
        )
      }

      const x_forwarded_seam_base_url = req.headers[
        "x-forwarded-seam-base-url"
      ] as string | undefined

      return publicMapDeviceModelV1({
        device_model,
        manufacturer,
        fake_devicedb_endpoint: `http://${req.headers.host}`,
        live_seam_connect_endpoint:
          req.db.live_seam_connect_endpoint ?? undefined,
        x_forwarded_seam_base_url,
      })
    }),
  })
})
