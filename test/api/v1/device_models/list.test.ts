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

test("GET /v1/device_models/list (filter by integration_support_levels)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      integration_support_levels: ["planned"],
    },
  })
  t.is(data.device_models.length, 0)
})

// UPSTREAM: nextlove does not parse this as the empty array
// https://github.com/seamapi/nextlove/issues/77#issuecomment-1786284982
test.failing(
  "GET /v1/device_models/list (filter by integration_support_levels, empty list)",
  async (t) => {
    const { axios } = await getTestServer(t)
    const { data } = await axios.get("/v1/device_models/list", {
      params: {
        integration_support_levels: [],
      },
    })
    t.is(data.device_models.length, 0)
  },
)

test("GET /v1/device_models/list (filter by integration_support_levels, multi levels)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      integration_support_levels: ["planned", "stable"],
    },
  })
  t.is(data.device_models.length, 1)
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

// UPSTREAM: nextlove does not parse this as the empty array
// https://github.com/seamapi/nextlove/issues/77#issuecomment-1786284982
test.failing("GET /v1/device_models/list (empty include_if)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      include_if: [],
    },
  })
  t.is(data.device_models.length, 0)
})

test("GET /v1/device_models/list (filter by include_if)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      include_if: ["software_features.can_program_access_codes"],
    },
  })
  t.true(data.device_models.length > 0)
  const device_model = data.device_models[0]
  if (
    device_model != null &&
    "software_features" in device_model &&
    "can_program_access_codes" in device_model.software_features
  ) {
    t.true(device_model.software_features.can_program_access_codes)
  } else {
    t.fail("can_program_access_codes not in device_model")
  }
})

test("GET /v1/device_models/list (filter by exclude_if)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/device_models/list", {
    params: {
      exclude_if: ["physical_properties.has_camera"],
    },
  })
  t.true(data.device_models.length > 0)
  const device_model = data.device_models[0]
  if (
    device_model != null &&
    "physical_properties" in device_model &&
    "has_camera" in device_model.physical_properties
  ) {
    t.false(device_model.physical_properties.has_camera)
  } else {
    t.fail("has_camera not in device_model")
  }
})
