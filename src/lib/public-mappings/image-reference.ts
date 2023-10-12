import type { ImageReference } from "@seamapi/types/devicedb"

import type { StoredImageReference } from "lib/models.ts"

interface PublicMapImageReferenceOptions {
  image: StoredImageReference
  external_image_proxy_endpoint?: string
  fake_devicedb_base_url: string
}

export const publicMapImageReference = ({
  fake_devicedb_base_url,
  image,
  external_image_proxy_endpoint,
}: PublicMapImageReferenceOptions): ImageReference => {
  const image_url = new URL("/images/view", "https://example.com")
  image_url.searchParams.set("image_id", image.image_id)
  if (external_image_proxy_endpoint) {
    image_url.searchParams.set(
      "_fake_external_image_proxy_endpoint",
      external_image_proxy_endpoint,
    )
  }

  const full_url = `${fake_devicedb_base_url}${image_url.pathname}${image_url.search}`

  return {
    url: full_url,
    width: image.width,
    height: image.height,
  }
}
