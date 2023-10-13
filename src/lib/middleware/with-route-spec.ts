import { createWithRouteSpec } from "nextlove"

import withDb from "./with-db.ts"
import withVercelProtectionBypassSecret from "./with-vercel-protection-bypass-secret.ts"

export const withRouteSpec = createWithRouteSpec({
  apiName: "DeviceDb fake",
  productionServerUrl: "https://example.com",
  shouldValidateGetRequestBody: false,
  globalMiddlewares: [withDb],
  authMiddlewareMap: {
    vercel_protection_bypass_secret: withVercelProtectionBypassSecret,
  },
} as const)

export default withRouteSpec
