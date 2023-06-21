const endpoint = process.env.ENVIRONMENT === 'local' ? `http://localhost:${process.env.API_PORT}/api` : `${process.env.BACKEND_URL}/api`;
const supertest = require('supertest')

const request = supertest(endpoint);

describe("Testing GET routes for /requests endpoint", () => {
  const uniqueID = 888888;
  let documentID;
  // Insert an entry so there's something to get
  beforeAll(async () => {
    const response = await request.post("/requests").send({
      idir: "W0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A2",
      firstName: "Fred",
      lastName: "Rick",
      employeeId: uniqueID,
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
    documentID = response.body._id;
  })

  test("Document is updated to have a state of 0 (DELETED)", async () => {
    let response = await request.patch(`/requests/${documentID}`).send({ state: 0, isAdmin: true });
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    response = await request.get(`/requests/${documentID}`);
    expect(response.body.state).toBe(0);
  });

  test("404 code returned when ID provided doesn't exist", async () => {
    const response = await request.patch(`/requests/6453d4371d73f4c66c983618`).send({ state: 0 });
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  test("400 code returned if ID doesn't match schema", async () => {
    const response = await request.patch(`/requests/111`).send({ state: 0 });
    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
  });

  test("403 code returned if trying to change to a non-existent state", async () => {
    const response = await request.patch(`/requests/${documentID}`).send({ state: 99 });
    expect(response.ok).toBe(false);
    expect(response.status).toBe(403);
  });
});
