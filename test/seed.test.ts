import test from "ava"
import axios from "axios"

import {
  createDatabase,
  seedDatabase,
  seedDatabaseFromApi,
} from "@seamapi/fake-devicedb"

import { getTestServer } from "fixtures/get-test-server.ts"

test("seed database", async (t) => {
  const db = createDatabase()
  t.notThrows(() => {
    seedDatabase(db)
  })
})

test("seed database from api", async (t) => {
  const { serverURL, db: apiDb } = await getTestServer(t, { seed: false })

  apiDb.setExternalImageProxyEndpoint("https://proxy.example.com")

  const manufacturer = apiDb.addManufacturer({
    manufacturer_id: "00000000-0000-0000-0000-000000000001",
    display_name: "Not Seam",
    logo: {
      image_id: "00000000-0000-0000-0000-000000000001",
      width: 1,
      height: 2,
    },
    integration: "stable",
    integration_support_level: "stable",
    is_connect_webview_supported: true,
    requires_seam_support_to_add_account: false,
    annotation_map: {},
  })

  const device_model = apiDb.addDeviceModel({
    device_model_id: "00000000-0000-0000-0000-000000000001",
    manufacturer_id: "00000000-0000-0000-0000-000000000001",
    is_device_supported: true,
    display_name: "Smart Lock 2",
    product_url: "https://example.com/smart-lock-2",
    main_connection_type: "wifi",
    main_category: "smartlock",
    aesthetic_variants: [
      {
        slug: "grey",
        display_name: "Grey",
        primary_color_hex: "#000000",
        manufacturer_sku: "123456",
        back_image: undefined,
        front_image: {
          image_id: "00000000-0000-0000-0000-000000000003",
          width: 3,
          height: 4,
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

  const db = createDatabase()

  const client = axios.create({
    baseURL: serverURL,
    headers: {
      "x-vercel-protection-bypass": db.vercel_protection_bypass_secret,
    },
  })

  await t.notThrowsAsync(async () => {
    await seedDatabaseFromApi(db, client)
  })

  t.deepEqual(db.manufacturers[0], { ...manufacturer, device_model_count: 1 })
  t.deepEqual(db.device_models[0], device_model)
})
