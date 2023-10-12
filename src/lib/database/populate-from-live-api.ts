import type { Routes } from "@seamapi/types/devicedb"
import axios from "axios"
import type { Simplify } from "type-fest"
import type { TypedAxios } from "typed-axios-instance"

import type { Database } from "./schema.ts"

interface PopulateFromLiveApiOptions {
  db: Database
  vercel_protection_bypass_secret: string
  endpoint: string
  device_category: Routes["/v1/device_models/list"]["queryParams"]["main_category"]
}

export const populateFromLiveApi = async ({
  db,
  endpoint,
  vercel_protection_bypass_secret,
  device_category,
}: PopulateFromLiveApiOptions) => {
  const client = axios.create({
    baseURL: endpoint,
    headers: {
      "x-vercel-protection-bypass": vercel_protection_bypass_secret,
    },
    // 🤷
  }) as TypedAxios<Simplify<Routes>>

  const {
    data: { device_models },
  } = await client.get("/v1/device_models/list", {
    params: {
      main_category: device_category,
    },
  })
  const {
    data: { manufacturers },
  } = await client.get("/v1/manufacturers/list")

  for (const manufacturer of manufacturers) {
    db.addManufacturerFromLiveApi(manufacturer)
  }

  for (const device_model of device_models) {
    db.addDeviceModelFromLiveApi(device_model)
  }
}
