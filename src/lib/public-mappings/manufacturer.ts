import type { Manufacturer } from "@seamapi/types/devicedb"

import type { Database } from "lib/database/index.ts"
import type { StoredManufacturer } from "lib/models.ts"

import { publicMapImageReference } from "./image-reference.ts"

interface PublicMapManufacturerOptions {
  manufacturer: StoredManufacturer
  fake_devicedb_base_url: string
  db: Database
}

export const publicMapManufacturer = ({
  manufacturer,
  fake_devicedb_base_url,
  db,
}: PublicMapManufacturerOptions): Manufacturer => ({
  manufacturer_id: manufacturer.manufacturer_id,
  display_name: manufacturer.display_name,
  logo: manufacturer.logo
    ? publicMapImageReference({
        image: manufacturer.logo,
        fake_devicedb_base_url,
      })
    : undefined,
  device_model_count: db.device_models.filter(
    (d) => d.manufacturer_id === manufacturer.manufacturer_id,
  ).length,
  integration: manufacturer.integration,
  is_connect_webview_supported: manufacturer.is_connect_webview_supported,
  requires_seam_support_to_add_account:
    manufacturer.requires_seam_support_to_add_account,
})
