import type { DeviceModelV1, Manufacturer } from "@seamapi/types/devicedb"
import type { HoistedStoreApi } from "zustand-hoist"

import type { StoredDeviceModelV1, StoredManufacturer } from "lib/models.ts"

export interface DatabaseState {
  manufacturers: StoredManufacturer[]
  device_models: StoredDeviceModelV1[]
  vercel_protection_secret: string
  external_image_proxy_endpoint: string | null
}

export interface DatabaseMethods {
  addManufacturerFromApi: (manufacturer: Manufacturer) => void
  addDeviceModelFromApi: (device_model: DeviceModelV1) => void
  addManufacturer: (manufacturer: StoredManufacturer) => StoredManufacturer
  addDeviceModel: (device_model: StoredDeviceModelV1) => StoredDeviceModelV1
  setExternalImageProxyEndpoint: (endpoint: string | null) => void
  update: (t?: number) => void
}

export type Database = DatabaseState & DatabaseMethods

export type ZustandDatabase = HoistedStoreApi<Database>
