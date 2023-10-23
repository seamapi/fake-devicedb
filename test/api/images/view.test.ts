import test, { type ExecutionContext } from "ava"
import getPixels from "get-pixels"

import { getTestServer } from "fixtures/get-test-server.ts"
import image from "lib/seam-logo.ts"

test("GET /images/view", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const response = await axios.get("/images/view", {
    params: {
      image_id: "00000000-0000-0000-0000-000000000000",
    },
    responseType: "arraybuffer",
  })

  t.is(response.status, 200)
  t.is(response.headers["content-type"], "image/png")

  const pixels = await new Promise((resolve, reject) => {
    getPixels(response.data as any, "image/png", (err, pixels) => {
      if (err) {
        reject(err)
        return
      }

      resolve(pixels)
    })
  })

  t.deepEqual((pixels as any).shape, [seam_logo.height, seam_logo.width, 4])
})
