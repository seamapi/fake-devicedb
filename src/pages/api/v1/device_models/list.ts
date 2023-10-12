import { routes } from "@seamapi/types/devicedb"

import { getBaseUrl } from "lib/get-base-url.ts"
import { withRouteSpec } from "lib/middleware/index.ts"
import { publicMapDeviceModelV1 } from "lib/public-mappings/device-model-v1.ts"

export default withRouteSpec({
  ...routes["/api/v1/device_models/list"],
  methods: ["GET", "POST", "OPTIONS"],
  auth: "vercel_protection_secret",
} as const)(async (req, res) => {
  let filtered_device_models = [...req.db.device_models]

  if (req.query.main_category) {
    filtered_device_models = filtered_device_models.filter(
      (device_model) => device_model.main_category === req.query.main_category,
    )
  }

  if (req.query.manufacturer_id) {
    filtered_device_models = filtered_device_models.filter(
      (device_model) =>
        device_model.manufacturer_id === req.query.manufacturer_id,
    )
  }

  if (req.query.manufacturer_ids) {
    filtered_device_models = filtered_device_models.filter(
      (device_model) =>
        req.query.manufacturer_ids?.includes(device_model.manufacturer_id),
    )
  }

  if (req.query.integration_status) {
    filtered_device_models = filtered_device_models.filter((device_model) => {
      const manufacturer = req.db.manufacturers.find(
        ({ manufacturer_id }) =>
          device_model.manufacturer_id === manufacturer_id,
      )

      if (!manufacturer) {
        throw new Error(
          `Manufacturer for device model ${device_model.device_model_id} cannot be found`,
        )
      }

      return manufacturer.integration === req.query.integration_status
    })
  }

  if (req.query.text_search) {
    filtered_device_models = filtered_device_models.filter((device_model) =>
      device_model.display_name
        .toLowerCase()
        .includes(req.query.text_search?.toLowerCase() ?? ""),
    )
  }

  res.status(200).json({
    device_models: filtered_device_models.map((device_model) => {
      const manufacturer = req.db.manufacturers.find(
        (m) => m.manufacturer_id === device_model.manufacturer_id,
      )

      if (!manufacturer) {
        throw new Error(
          `Manufacturer for device model ${device_model.device_model_id} cannot be found`,
        )
      }

      const fake_devicedb_base_url = getBaseUrl(req)

      return publicMapDeviceModelV1({
        device_model,
        manufacturer,
        fake_devicedb_base_url,
        external_image_proxy_endpoint:
          req.db.external_image_proxy_endpoint ?? undefined,
      })
    }),
  })
})
