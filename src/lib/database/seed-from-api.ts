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
    const hasManufacturer =
      db.manufacturers.find(
        (m) => m.manufacturer_id === manufacturer.manufacturer_id,
      ) != null

    if (hasManufacturer) continue

    const { logo, annotations, ...rest } = manufacturer
    db.addManufacturer({
      ...rest,
      annotation_map: annotations.reduce(
        (acc, cur) => ({ ...acc, [cur.annotation_code]: cur }),
        {},
      ),
      logo:
        logo != null
          ? {
              image_id: getImageIdFromImageUrl(logo.url),
              width: logo.width,
              height: logo.height,
            }
          : undefined,
    })
  }

  const {
    data: { device_models },
  } = await typedClient.get("/v1/device_models/list", {
    params: {
      main_category: device_category,
    },
  })

  for (const device_model of device_models) {
    const hasDeviceModel =
      db.device_models.find(
        (d) => d.device_model_id === device_model.device_model_id,
      ) != null

    if (hasDeviceModel) continue

    const { aesthetic_variants, manufacturer, ...rest } = device_model
    db.addDeviceModel({
      ...rest,
      // @ts-expect-error: Unknown type conflict in physical_properties
      physical_properties:
        "physical_properties" in rest ? rest.physical_properties : undefined,
      manufacturer_id: manufacturer.manufacturer_id,
      aesthetic_variants: aesthetic_variants.map((variant) => ({
        ...variant,
        front_image:
          variant.front_image != null
            ? {
                image_id: getImageIdFromImageUrl(variant.front_image.url),
                width: variant.front_image.width,
                height: variant.front_image.height,
              }
            : undefined,
        back_image:
          variant.back_image != null
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
  }
}

const getImageIdFromImageUrl = (url: string): string => {
  const searchParams = new URL(url).searchParams
  const imageId = searchParams.get("image_id")
  if (imageId) return imageId

  const proxiedUrl = searchParams.get("url")
  if (!proxiedUrl) throw new Error(`No image_id in "${url}"`)
  return getImageIdFromImageUrl(proxiedUrl)
}
