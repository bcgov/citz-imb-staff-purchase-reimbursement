const endpoint = `http://${process.env.HOSTNAME}:${process.env.API_PORT}/api`;
const supertest = require('supertest')

const request = supertest(endpoint);

describe("Testing that api exists and returns response", () => {
  test("API returns code 200", async () => {
    const response = await request.get("/health");
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });
});
