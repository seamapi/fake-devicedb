import type { Middleware } from "nextlove"

import type { Database } from "lib/database/index.ts"

export const withVercelProtectionBypassSecret: Middleware<
  {
    auth: { auth_mode: "vercel_protection_bypass_secret" }
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  if (req.db == null) {
    return res
      .status(500)
      .end(
        "The withVercelProtectionBypassSecret middleware requires req.db. Use it with the withDb middleware.",
      )
  }

  const secret = req.headers["x-vercel-protection-bypass"]
  if (secret !== req.db.vercel_protection_bypass_secret)
    return res.status(401).end("Unauthorized")

  req.auth = { auth_mode: "vercel_protection_bypass_secret" }

  return next(req, res)
}

withVercelProtectionBypassSecret.securitySchema = {
  type: "apiKey",
}

export default withVercelProtectionBypassSecret
