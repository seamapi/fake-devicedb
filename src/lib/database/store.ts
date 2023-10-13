import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"
import { hoist } from "zustand-hoist"

import type { Database, ZustandDatabase } from "./schema.ts"

export const createDatabase = (): ZustandDatabase => {
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const initializer = immer<Database>((set) => ({
  manufacturers: [],
  device_models: [],
  vercel_protection_bypass_secret: "abc123",
  external_image_proxy_endpoint:
    "https://connect.getseam.com/internal/devicedb_image_proxy",

  addManufacturer(manufacturer) {
    set((state) => {
      state.manufacturers.push(manufacturer)
    })

    return manufacturer
  },

  addDeviceModel(device_model) {
    set((state) => {
      state.device_models.push(device_model)
    })

    return device_model
  },

  setExternalImageProxyEndpoint(endpoint) {
    set((state) => {
      state.external_image_proxy_endpoint = endpoint
    })
  },

  update() {},
}))
