const endpoint = process.env.ENVIRONMENT === 'local' ? `http://localhost:${process.env.API_PORT}/api` : `${process.env.BACKEND_URL}/api`;
const supertest = require('supertest')

const request = supertest(endpoint);

describe("Testing POST route for /requests endpoint", () => {
  test("API returns code 201 on successful submission", async () => {
    const response = await request.post("/requests").send({
      idir: "W0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A3",
      firstName: "Fred",
      lastName: "Rick",
      employeeId: 999999,
      purchases: [
        {
          "supplier": "Office Snacks",
          "purchaseDate": "2023-05-17T00:00:00-07:00",
          "cost": 432.34,
        },
        {
          "supplier": "Desk Chair",
          "purchaseDate": "2023-05-18T00:00:00-07:00",
          "cost": 333
        }
      ],
      additionalComments: "More snacks and a comfy chair for the home office.",
      submit: true
    });
    expect(response.ok).toBe(true);
    expect(response.status).toBe(201);
    // id should have been created
    expect(response.body._id).toBeTruthy();
  });
});
