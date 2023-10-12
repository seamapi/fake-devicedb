import type { ImageReference } from "@seamapi/types/devicedb"

import type { StoredImageReference } from "lib/models.ts"

interface PublicMapImageReferenceOptions {
  fake_devicedb_endpoint: string
  image: StoredImageReference
  external_image_proxy_endpoint?: string
  x_forwarded_seam_base_url?: string
}

export const publicMapImageReference = ({
  fake_devicedb_endpoint,
  image,
  external_image_proxy_endpoint,
  x_forwarded_seam_base_url,
}: PublicMapImageReferenceOptions): ImageReference => {
  const image_url = new URL("/images/view", fake_devicedb_endpoint)
  image_url.searchParams.set("image_id", image.image_id)
  if (external_image_proxy_endpoint) {
    image_url.searchParams.set(
      "_fake_external_image_proxy_endpoint",
      external_image_proxy_endpoint,
    )
  }

  const full_url = x_forwarded_seam_base_url
    ? `${x_forwarded_seam_base_url}${image_url.pathname}${image_url.search}`
    : image_url.toString()

  return {
    url: full_url,
    width: image.width,
    height: image.height,
  }
}
