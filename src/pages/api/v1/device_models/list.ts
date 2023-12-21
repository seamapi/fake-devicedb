import { routes } from "@seamapi/types/devicedb"
import { get } from "lodash"

import { getBaseUrl } from "lib/get-base-url.ts"
import { withRouteSpec } from "lib/middleware/index.ts"
import type { StoredDeviceModelV1 } from "lib/models.ts"
import { publicMapDeviceModelV1 } from "lib/public-mappings/device-model-v1.ts"

export default withRouteSpec({
  ...routes["/api/v1/device_models/list"],
  methods: ["GET", "POST", "OPTIONS"],
  auth: "vercel_protection_bypass_secret",
} as const)(async (req, res) => {
  const device_models = req.db.device_models

  res.status(200).json({
    device_models: device_models
      .filter((device_model: StoredDeviceModelV1) => {
        const { exclude_if } = req.query
        if (exclude_if == null) return true

        return exclude_if
          .map((path) => get(device_model, path))
          .every((v) => v !== true)
      })
      .filter((device_model: StoredDeviceModelV1) => {
        const { include_if } = req.query
        if (include_if == null) return true
        if (include_if.length === 0) return false

        return include_if
          .map((path) => get(device_model, path))
          .every((v) => v === true)
      })
      .filter((device_model: StoredDeviceModelV1) => {
        const { main_category } = req.query
        if (main_category == null) return true

        return device_model.main_category === main_category
      })
      .filter((device_model: StoredDeviceModelV1) => {
        const { manufacturer_id } = req.query
        if (manufacturer_id == null) return true

        return device_model.manufacturer_id === manufacturer_id
      })
      .filter((device_model: StoredDeviceModelV1) => {
        const { manufacturer_ids } = req.query
        if (manufacturer_ids == null) return true

        return manufacturer_ids.includes(device_model.manufacturer_id)
      })
      .filter((device_model: StoredDeviceModelV1) => {
        const { integration_status } = req.query
        if (integration_status == null) return true

        const manufacturer = req.db.manufacturers.find(
          ({ manufacturer_id }) =>
            device_model.manufacturer_id === manufacturer_id,
        )

        if (manufacturer == null) return false

        return manufacturer.integration_support_level === integration_status
      })
      .filter((device_model: StoredDeviceModelV1) => {
        const { integration_support_levels } = req.query
        if (integration_support_levels == null) return true
        if (integration_support_levels.length === 0) return false

        const manufacturer = req.db.manufacturers.find(
          ({ manufacturer_id }) =>
            device_model.manufacturer_id === manufacturer_id,
        )

        if (manufacturer == null) return false

        return integration_support_levels.includes(
          manufacturer.integration_support_level,
        )
      })
      .filter((device_model: StoredDeviceModelV1) => {
        const { text_search } = req.query
        if (text_search == null) return true

        return device_model.display_name
          .toLowerCase()
          .includes(text_search.toLowerCase())
      })
      .map((device_model) => {
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
          db: req.db,
        })
      }),
  })
})
