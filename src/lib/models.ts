import { schemas } from "@seamapi/types/devicedb"
import { z } from "zod"

export const stored_image_reference = z.object({
  image_id: z.string(),
  width: z.number(),
  height: z.number(),
})
export type StoredImageReference = z.infer<typeof stored_image_reference>

export const stored_manufacturer = schemas.manufacturer
  .omit({ logo: true })
  .merge(
    z.object({
      logo: stored_image_reference.optional(),
    }),
  )
export type StoredManufacturer = z.infer<typeof stored_manufacturer>

export const stored_device_model_v1 = schemas.base_device_model_v1
  .omit({ manufacturer: true, aesthetic_variants: true })
  .merge(
    z.object({
      manufacturer_id: z.string(),
      aesthetic_variants: z
        .object({
          slug: z.string(),
          display_name: z.string(),
          primary_color_hex: z.string().optional(),
          manufacturer_sku: z.string().optional(),
          front_image: stored_image_reference.optional(),
          back_image: stored_image_reference.optional(),
          images: stored_image_reference.array(),
        })
        .array(),
    }),
  )
  .and(schemas.device_model_category_specific_properties)
export type StoredDeviceModelV1 = z.infer<typeof stored_device_model_v1>
