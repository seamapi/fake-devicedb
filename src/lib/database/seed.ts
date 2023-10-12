import { seam_logo } from "lib/seam_logo.ts"

import type { Database } from "./schema.ts"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Seed {}

export const seedDatabase = (db: Database): Seed => {
  db.setLiveSeamConnectEndpoint(null)

  db.addManufacturer({
    manufacturer_id: "00000000-0000-0000-0000-000000000000",
    display_name: "Seam",
    logo: {
      image_id: "00000000-0000-0000-0000-000000000000",
      width: seam_logo.width,
      height: seam_logo.height,
    },
    integration: "stable",
    is_connect_webview_supported: true,
    requires_seam_support_to_add_account: false,
  })

  db.addDeviceModel({
    device_model_id: "00000000-0000-0000-0000-000000000000",
    manufacturer_id: "00000000-0000-0000-0000-000000000000",
    is_device_supported: true,
    display_name: "Smart Lock",
    product_url: "https://example.com/smart-lock",
    main_connection_type: "wifi",
    main_category: "smartlock",
    aesthetic_variants: [
      {
        slug: "grey",
        display_name: "Grey",
        primary_color_hex: "#000000",
        manufacturer_sku: "123456",
        front_image: {
          image_id: "00000000-0000-0000-0000-000000000000",
          width: seam_logo.width,
          height: seam_logo.height,
        },
        images: [],
      },
    ],
    description: "",
    power_sources: ["battery"],
    physical_properties: {
      lock_type: "deadbolt",
      has_camera: false,
      has_physical_key: true,
    },
    software_features: {
      can_program_access_codes: true,
      can_program_access_codes_offline: true,
      can_program_access_schedules: true,
      can_remotely_unlock: true,
    },
  })

  return {}
}
