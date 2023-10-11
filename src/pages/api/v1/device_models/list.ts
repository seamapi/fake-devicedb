import { schemas } from "@seamapi/types/devicedb"
import { z } from "zod"

import { getFullUrlToFakeResource } from "lib/get-base-url.ts"
import { withRouteSpec } from "lib/middleware/index.ts"
import { seam_logo } from "lib/seam_logo.ts"

export default withRouteSpec({
  auth: "vercel_protection_secret",
  methods: ["GET"],
  middlewares: [],
  jsonResponse: z.object({
    device_models: schemas.device_model_v1.array(),
  }),
} as const)(async (req, res) => {
  res.status(200).json({
    device_models: [
      {
        device_model_id: "00000000-0000-0000-0000-000000000000",
        manufacturer: {
          manufacturer_id: "00000000-0000-0000-0000-000000000000",
          display_name: "Seam",
          logo: {
            url: getFullUrlToFakeResource(
              req,
              "images/view?image_id=00000000-0000-0000-0000-000000000000",
            ),
            width: seam_logo.width,
            height: seam_logo.height,
          },
          integration: "stable",
          is_connect_webview_supported: true,
          requires_seam_support_to_add_account: false,
        },
        is_device_supported: true,
        display_name: "Smart Lock",
        product_url: "https://example.com/smart-lock",
        main_connection_type: "wifi",
        main_category: "smartlock",
        aesthetic_variants: [
          // @ts-expect-error TODO Fix this
          {
            slug: "grey",
            display_name: "Grey",
            primary_color_hex: "#000000",
            manufacturer_sku: "123456",
            front_image: {
              url: getFullUrlToFakeResource(
                req,
                "images/view?image_id=00000000-0000-0000-0000-000000000000",
              ),
              width: seam_logo.width,
              height: seam_logo.height,
            },
          },
        ],
      },
    ],
  })
})
