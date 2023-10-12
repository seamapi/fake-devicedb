import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"
import { hoist } from "zustand-hoist"

import type { Database, ZustandDatabase } from "./schema.ts"

export const createDatabase = (): ZustandDatabase => {
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const getImageIdFromImageUrl = (url: string): string => {
  const image_url = new URL(url)
  const image_id = image_url.searchParams.get("image_id")
  if (!image_id) {
    throw new Error(`No image_id in ${url}`)
  }

  return image_id
}

const initializer = immer<Database>((set, get) => ({
  manufacturers: [],
  device_models: [],
  vercel_protection_secret: "abc123",
  live_seam_connect_endpoint: "https://connect.getseam.com",

  addManufacturerFromLiveApi(manufacturer) {
    const { logo, ...rest } = manufacturer

    if (
      get().manufacturers.find(
        (m) => m.manufacturer_id === rest.manufacturer_id,
      )
    ) {
      return
    }

    set((state) => {
      state.manufacturers.push({
        ...rest,
        logo: logo
          ? {
              image_id: getImageIdFromImageUrl(logo.url),
              width: logo.width,
              height: logo.height,
            }
          : undefined,
      })
    })
  },

  addDeviceModelFromLiveApi(device_model) {
    const { aesthetic_variants, manufacturer, ...rest } = device_model

    if (
      get().device_models.find(
        (m) => m.device_model_id === rest.device_model_id,
      )
    ) {
      return
    }

    get().addManufacturerFromLiveApi(manufacturer)

    set((state) => {
      state.device_models.push({
        ...rest,
        manufacturer_id: manufacturer.manufacturer_id,
        aesthetic_variants: aesthetic_variants.map((variant) => ({
          ...variant,
          front_image: variant.front_image
            ? {
                image_id: getImageIdFromImageUrl(variant.front_image.url),
                width: variant.front_image.width,
                height: variant.front_image.height,
              }
            : undefined,
          back_image: variant.back_image
            ? {
                image_id: getImageIdFromImageUrl(variant.back_image.url),
                width: variant.back_image.width,
                height: variant.back_image.height,
              }
            : undefined,
          images: variant.images.map((image) => ({
            image_id: getImageIdFromImageUrl(image.url),
            width: image.width,
            height: image.height,
          })),
        })),
      })
    })
  },

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

  setLiveSeamConnectEndpoint(endpoint) {
    set((state) => {
      state.live_seam_connect_endpoint = endpoint
    })
  },

  update() {},
}))
