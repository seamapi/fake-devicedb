export type Routes = {
  "/health": {
    route: "/health"
    method: "GET"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      note: string
      ok: boolean
    }
  }
  "/images/view": {
    route: "/images/view"
    method: "GET"
    queryParams: {
      image_id: string
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {}
  }
  "/v1/device_models/list": {
    route: "/v1/device_models/list"
    method: "GET"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      device_models: {
        device_model_id: string
        manufacturer: {
          manufacturer_id: string
          display_name: string
          logo?:
            | {
                url: string
                width: number
                height: number
              }
            | undefined
          integration: "stable" | "beta" | "planned" | "unsupported"
          is_connect_webview_supported: boolean
          requires_seam_support_to_add_account: boolean
        }
        is_device_supported: boolean
        display_name: string
        product_url: string
        main_connection_type: "wifi" | "zwave" | "zigbee" | "unknown"
        main_category: "smartlock" | "thermostat" | "noise_sensor"
        aesthetic_variants: {
          slug: string
          display_name: string
          primary_color_hex?: string | undefined
          manufacturer_sku: string
          front_image?:
            | {
                url: string
                width: number
                height: number
              }
            | undefined
          back_image?:
            | {
                url: string
                width: number
                height: number
              }
            | undefined
        }[]
      }[]
    }
  }
}

export type RouteResponse<Path extends keyof Routes> =
  Routes[Path]["jsonResponse"]

export type RouteRequestBody<Path extends keyof Routes> =
  Routes[Path]["jsonBody"] & Routes[Path]["commonParams"]

export type RouteRequestParams<Path extends keyof Routes> =
  Routes[Path]["queryParams"] & Routes[Path]["commonParams"]
