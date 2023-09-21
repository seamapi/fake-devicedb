import type { Middleware } from "nextlove"

import type { Database } from "lib/database/index.ts"

export const withVercelProtectionSecret: Middleware<
  {
    auth: { auth_mode: "vercel_protection_secret" }
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  if (req.db == null) {
    return res
      .status(500)
      .end(
        "The withVercelProtectionSecret middleware requires req.db. Use it with the withDb middleware.",
      )
  }

  const secret = req.headers["x-vercel-protection-bypass"]
  if (secret !== req.db.vercel_protection_secret)
    return res.status(401).end("Unauthorized")

  req.auth = { auth_mode: "vercel_protection_secret" }

  return next(req, res)
}

withVercelProtectionSecret.securitySchema = {
  type: "apiKey",
}

export default withVercelProtectionSecret
