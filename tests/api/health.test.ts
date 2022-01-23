import test from "ava"
import getTestServer from "../fixtures/get-test-server"

test("GET /health", async (t) => {
  const { axios } = await getTestServer(t)

  const res = await axios.get("/health")

  t.is(res.data.status, "ok")
})
