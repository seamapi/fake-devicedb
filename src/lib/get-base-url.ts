import type { NextApiRequest } from "next"

export const getFullUrlToFakeResource = (
  req: Pick<NextApiRequest, "headers" | "socket">,
  path_on_fake: string,
): string => {
  const seam_connect_forwarded = req.headers["x-forwarded-seam-base-url"]

  if (seam_connect_forwarded) {
    const url = new URL(seam_connect_forwarded as string)

    return `${url.toString()}/${path_on_fake}`
  }

  const host = req.headers.host
  const url = new URL(`http://${host}`)
  return `${url.toString()}${path_on_fake}`
}

export const getBaseUrl = (
  req: Pick<NextApiRequest, "headers" | "socket">,
): string => {
  const seam_connect_forwarded = req.headers["x-forwarded-seam-base-url"]

  if (seam_connect_forwarded) {
    return seam_connect_forwarded as string
  }

  return `http://${req.headers.host}`
}
