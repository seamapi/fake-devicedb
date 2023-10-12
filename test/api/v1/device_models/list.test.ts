import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /v1/device_models/list", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list")

  // Attempt to fetch image
  const image_response = await axios.get(
    data.device_models[0]?.manufacturer.logo?.url as any,
  )
  t.is(image_response.headers["content-type"], "image/png")
})

test("GET /v1/device_models/list (image URL is correct with X-Forwarded-Seam-Base-Url)", async (t) => {
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

test("GET /v1/device_models/list (throws 401 for wrong bypass secret)", async (t) => {
  const { axios } = await getTestServer(t)
  const { status } = await axios.get("/v1/device_models/list", {
    headers: {
      "x-vercel-protection-bypass": "wrong",
    },
    validateStatus: () => true,
  })

  t.is(status, 401)
})

test("GET /v1/device_models/list (filter by main_category)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      main_category: "intercom",
    },
  })
  t.is(data.device_models.length, 0)
})

test("GET /v1/device_models/list (filter by manufacturer_id)", async (t) => {
  const { axios, seed } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      manufacturer_id: seed.manufacturer.manufacturer_id,
    },
  })
  t.is(data.device_models.length, 1)
})

test("GET /v1/device_models/list (filter by manufacturer_ids)", async (t) => {
  const { axios, seed } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      manufacturer_ids: [seed.manufacturer.manufacturer_id],
    },
  })
  t.is(data.device_models.length, 1)
})

test("GET /v1/device_models/list (filter by integration status)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      integration_status: "planned",
    },
  })
  t.is(data.device_models.length, 0)
})

test("GET /v1/device_models/list (filter by text_search)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      text_search: "lock",
    },
  })
  t.is(data.device_models.length, 1)
})
