import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /v1/device_models/list", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list")

  // Attempt to fetch image
  const image_response = await axios.get(
    data.device_models[0]?.manufacturer.logo?.url as any,
  )
  t.is(image_response.headers["content-type"], "image/png")
})

test("GET /v1/device_models/list (image URL is correct with X-Forwarded-Seam-Base-Url)", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    headers: {
      "X-Forwarded-Seam-Base-Url": "https://example.com/devicedb",
    },
  })

  // Attempt to fetch image
  const image_url = data.device_models[0]?.manufacturer.logo?.url
  t.is(
    image_url,
    "https://example.com/devicedb/images/view?image_id=00000000-0000-0000-0000-000000000000",
  )
})
