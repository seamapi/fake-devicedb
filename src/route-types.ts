export type Routes = {
  "/_fake/seed_from_api": {
    route: "/_fake/seed_from_api"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_category?:
        | (
            | "smartlock"
            | "sensor"
            | "thermostat"
            | "relay"
            | "intercom"
            | "accessory"
          )
        | undefined
      vercel_protection_bypass_secret: string
      device_db_endpoint: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {}
  }
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
  "/v1/device_models/get": {
    route: "/v1/device_models/get"
    method: "GET" | "OPTIONS"
    queryParams: {
      device_model_id: string
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      device_model: {
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
          integration: "stable" | "beta" | "planned" | "unsupported" | "inquire"
          integration_support_level:
            | "stable"
            | "beta"
            | "planned"
            | "unsupported"
            | "inquire"
          is_connect_webview_supported: boolean
          requires_seam_support_to_add_account: boolean
          annotations: {
            annotation_code: "subscription_required"
            message: string
          }[]
        }
        is_device_supported: boolean
        display_name: string
        description: string
        product_url?: string | undefined
        main_connection_type: "wifi" | "zwave" | "zigbee" | "unknown"
        hardware: {
          has_physical_key?: boolean | undefined
        }
        aesthetic_variants: {
          slug: string
          display_name: string
          primary_color_hex?: string | undefined
          manufacturer_sku?: string | undefined
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
          images: {
            url: string
            width: number
            height: number
          }[]
        }[]
        power_sources: (
          | "battery"
          | "hardwired"
          | "mechanical_harvesting"
          | "wireless"
          | "ethernet"
        )[]
      } & (
        | {
            main_category: "smartlock"
            physical_properties: {
              lock_type:
                | "deadbolt"
                | "lever"
                | "mortise"
                | "lockbox"
                | "cylinder"
                | "padlock"
                | "locker"
                | "unknown"
              has_physical_key: boolean
              has_camera: boolean
            }
            software_features: {
              can_remotely_unlock: boolean
              can_program_access_codes: boolean
              can_program_access_schedules: boolean
              can_program_access_codes_offline: boolean
            }
            can_remotely_unlock?: true | undefined
            can_program_online_access_codes?: true | undefined
          }
        | {
            main_category: "sensor"
            physical_properties: {
              has_noise_sensor: boolean
              has_humidity_sensor: boolean
              has_temperature_sensor: boolean
              has_occupancy_detection: boolean
            }
          }
        | {
            main_category: "thermostat"
            physical_properties: {
              available_modes: ("heat" | "cool" | "fan" | "eco")[]
              is_heat_pump_compatible: boolean
              has_occupancy_detection: boolean
              supports_demand_response: boolean
              has_humidity_sensor: boolean
              has_temperature_sensor: boolean
              supports_emergency_heating_mode: boolean
            }
            software_features: {
              can_program_climate_schedules: boolean
            }
          }
        | {
            main_category: "relay"
          }
        | {
            main_category: "intercom"
            physical_properties: {
              has_camera: boolean
              has_rfid_reader?: boolean
              has_nfc_reader?: boolean
              has_wiegand_interface?: boolean
            }
            software_features: {
              can_remotely_unlock: boolean
              can_program_access_codes: boolean
              can_unlock_with_face_recognition?: boolean
              supports_onvif?: boolean
            }
          }
        | {
            main_category: "accessory"
          }
      )
    }
  }
  "/v1/device_models/list": {
    route: "/v1/device_models/list"
    method: "GET" | "POST" | "OPTIONS"
    queryParams: {
      main_category?:
        | (
            | "smartlock"
            | "sensor"
            | "thermostat"
            | "relay"
            | "intercom"
            | "accessory"
          )
        | undefined
      manufacturer_id?: string | undefined
      manufacturer_ids?: string[] | undefined
      integration_status?:
        | ("stable" | "beta" | "planned" | "unsupported" | "inquire")
        | undefined
      integration_support_levels?:
        | ("stable" | "beta" | "planned" | "unsupported" | "inquire")[]
        | undefined
      text_search?: string | undefined
      include_if?: string[] | undefined
      exclude_if?: string[] | undefined
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      device_models: ({
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
          integration: "stable" | "beta" | "planned" | "unsupported" | "inquire"
          integration_support_level:
            | "stable"
            | "beta"
            | "planned"
            | "unsupported"
            | "inquire"
          is_connect_webview_supported: boolean
          requires_seam_support_to_add_account: boolean
          annotations: {
            annotation_code: "subscription_required"
            message: string
          }[]
        }
        is_device_supported: boolean
        display_name: string
        description: string
        product_url?: string | undefined
        main_connection_type: "wifi" | "zwave" | "zigbee" | "unknown"
        hardware: {
          has_physical_key?: boolean | undefined
        }
        aesthetic_variants: {
          slug: string
          display_name: string
          primary_color_hex?: string | undefined
          manufacturer_sku?: string | undefined
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
          images: {
            url: string
            width: number
            height: number
          }[]
        }[]
        power_sources: (
          | "battery"
          | "hardwired"
          | "mechanical_harvesting"
          | "wireless"
          | "ethernet"
        )[]
      } & (
        | {
            main_category: "smartlock"
            physical_properties: {
              lock_type:
                | "deadbolt"
                | "lever"
                | "mortise"
                | "lockbox"
                | "cylinder"
                | "padlock"
                | "locker"
                | "unknown"
              has_physical_key: boolean
              has_camera: boolean
            }
            software_features: {
              can_remotely_unlock: boolean
              can_program_access_codes: boolean
              can_program_access_schedules: boolean
              can_program_access_codes_offline: boolean
            }
            can_remotely_unlock?: true | undefined
            can_program_online_access_codes?: true | undefined
          }
        | {
            main_category: "sensor"
            physical_properties: {
              has_noise_sensor: boolean
              has_humidity_sensor: boolean
              has_temperature_sensor: boolean
              has_occupancy_detection: boolean
            }
          }
        | {
            main_category: "thermostat"
            physical_properties: {
              available_modes: ("heat" | "cool" | "fan" | "eco")[]
              is_heat_pump_compatible: boolean
              has_occupancy_detection: boolean
              supports_demand_response: boolean
              has_humidity_sensor: boolean
              has_temperature_sensor: boolean
              supports_emergency_heating_mode: boolean
            }
            software_features: {
              can_program_climate_schedules: boolean
            }
          }
        | {
            main_category: "relay"
          }
        | {
            main_category: "intercom"
            physical_properties: {
              has_camera: boolean
              has_rfid_reader?: boolean
              has_nfc_reader?: boolean
              has_wiegand_interface?: boolean
            }
            software_features: {
              can_remotely_unlock: boolean
              can_program_access_codes: boolean
              can_unlock_with_face_recognition?: boolean
              supports_onvif?: boolean
            }
          }
        | {
            main_category: "accessory"
          }
      ))[]
    }
  }
  "/v1/manufacturers/get": {
    route: "/v1/manufacturers/get"
    method: "GET" | "POST" | "OPTIONS"
    queryParams: {
      manufacturer_id: string
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
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
        integration: "stable" | "beta" | "planned" | "unsupported" | "inquire"
        integration_support_level:
          | "stable"
          | "beta"
          | "planned"
          | "unsupported"
          | "inquire"
        is_connect_webview_supported: boolean
        requires_seam_support_to_add_account: boolean
        device_model_count: number
        annotations: {
          annotation_code: "subscription_required"
          message: string
        }[]
      }
    }
  }
  "/v1/manufacturers/list": {
    route: "/v1/manufacturers/list"
    method: "GET" | "POST" | "OPTIONS"
    queryParams: {
      integration_status?:
        | ("stable" | "beta" | "planned" | "unsupported" | "inquire")
        | undefined
      integration_support_levels?:
        | ("stable" | "beta" | "planned" | "unsupported" | "inquire")[]
        | undefined
      liqe_query?: string | undefined
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      manufacturers: {
        manufacturer_id: string
        display_name: string
        logo?:
          | {
              url: string
              width: number
              height: number
            }
          | undefined
        integration: "stable" | "beta" | "planned" | "unsupported" | "inquire"
        integration_support_level:
          | "stable"
          | "beta"
          | "planned"
          | "unsupported"
          | "inquire"
        is_connect_webview_supported: boolean
        requires_seam_support_to_add_account: boolean
        device_model_count: number
        annotations: {
          annotation_code: "subscription_required"
          message: string
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
