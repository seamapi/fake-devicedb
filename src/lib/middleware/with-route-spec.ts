import { createWithRouteSpec } from "nextlove"

import withDb from "./with-db.ts"
import withVercelProtectionSecret from "./with-vercel-protection-secret.ts"

export const withRouteSpec = createWithRouteSpec({
  apiName: "DeviceDb fake",
  productionServerUrl: "https://example.com",
  shouldValidateGetRequestBody: false,
  globalMiddlewares: [withDb],
  authMiddlewareMap: {
    vercel_protection_secret: withVercelProtectionSecret,
  },
} as const)

export default withRouteSpec
