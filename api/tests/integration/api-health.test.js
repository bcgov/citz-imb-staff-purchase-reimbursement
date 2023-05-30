const endpoint = process.env.ENVIRONMENT === 'local' ? `http://localhost:${process.env.API_PORT}/api` : `${process.env.BACKEND_URL}/api`;
const supertest = require('supertest')
console.log(endpoint)
const request = supertest(endpoint);

describe("Testing that api exists and returns response", () => {
  test("API returns code 200", async () => {
    const response = await request.get("/health");
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });
});
