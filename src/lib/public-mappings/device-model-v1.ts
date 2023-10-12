import type { DeviceModelV1 } from "@seamapi/types/devicedb"

import type { StoredDeviceModelV1, StoredManufacturer } from "lib/models.ts"

import { publicMapImageReference } from "./image-reference.ts"
import { publicMapManufacturer } from "./manufacturer.ts"

interface PublicMapDeviceModelV1Options {
  device_model: StoredDeviceModelV1
  manufacturer: StoredManufacturer
  fake_devicedb_base_url: string
  external_image_proxy_endpoint?: string
}

export const publicMapDeviceModelV1 = ({
  device_model: { aesthetic_variants, manufacturer_id, ...rest },
  manufacturer,
  fake_devicedb_base_url,
  external_image_proxy_endpoint,
}: PublicMapDeviceModelV1Options): DeviceModelV1 => ({
  ...rest,
  manufacturer: publicMapManufacturer({
    manufacturer,
    fake_devicedb_base_url,
    external_image_proxy_endpoint,
  }),
  aesthetic_variants: aesthetic_variants.map(
    ({ images, front_image, back_image, ...rest }) => ({
      ...rest,
      images: images.map((image) =>
        publicMapImageReference({
          image,
          fake_devicedb_base_url,
          external_image_proxy_endpoint,
        }),
      ),
      front_image: front_image
        ? publicMapImageReference({
            image: front_image,
            fake_devicedb_base_url,
            external_image_proxy_endpoint,
          })
        : undefined,
      back_image: back_image
        ? publicMapImageReference({
            image: back_image,
            fake_devicedb_base_url,
            external_image_proxy_endpoint,
          })
        : undefined,
    }),
  ),
})
