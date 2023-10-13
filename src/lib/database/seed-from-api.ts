import type { DeviceCategory, Routes } from "@seamapi/types/devicedb"
import type { AxiosInstance } from "axios"
import type { Simplify } from "type-fest"
import type { TypedAxios } from "typed-axios-instance"

import type { Database } from "./schema.ts"

interface SeedFromApiOptions {
  device_category?: DeviceCategory
}

export const seedDatabaseFromApi = async (
  db: Database,
  client: AxiosInstance,
  { device_category = "smartlock" }: SeedFromApiOptions = {},
) => {
  const typedClient = client as TypedAxios<Simplify<Routes>>

  const {
    data: { manufacturers },
  } = await typedClient.get("/v1/manufacturers/list")

  for (const manufacturer of manufacturers) {
    db.addManufacturerFromApi(manufacturer)
  }

  const {
    data: { device_models },
  } = await typedClient.get("/v1/device_models/list", {
    params: {
      main_category: device_category,
    },
  })

  for (const device_model of device_models) {
    db.addDeviceModelFromApi(device_model)
  }
}
