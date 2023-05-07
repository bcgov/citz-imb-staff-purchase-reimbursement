const endpoint = `${process.env.HOSTNAME}:${process.env.API_PORT}/api`;
const exp = require('constants');
const supertest = require('supertest')

const request = supertest(endpoint);

describe("Testing GET routes for /requests endpoint", () => {
  const uniqueID = 888888;
  let documentID;
  // Insert an entry so there's something to get
  beforeAll(async () => {
    const response = await request.post("/requests").send({
      data: {
        lateEntry: false,
        idir: "W0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A2",
        firstName: "John",
        lastName: "Smith",
        employeeId: uniqueID,
        itemsPurchased: [
          "Dogs"
        ],
        totalCost: 45.46,
        purchaseDate: "2023-04-05T00:00:00-07:00",
        attachReceipts: [
          {
            storage: 'chefs',
            url: 'some/link',
            size: 9001,
            data: {
              id: 'fe0000'
            },
            originalName: 'file.pdf'
          }
        ],
        approvalDate: "2023-04-13T00:00:00-07:00",
        attachApproval: [
          {
            storage: 'chefs',
            url: 'some/link',
            size: 9001,
            data: {
              id: 'fe0000'
            },
            originalName: 'file.pdf'
          }
        ],
        supplierName: "Jimmy's Dogs",
        supplierPhoneNumber: "(324) 324-2342",
        supplierEmail: "jimmys@yahoo.com",
        additionalComments: "Great purchase!",
        submit: true,
      }
    });
    documentID = response.body._id;
  })

  test("Document is updated to have a state of 0 (DELETED)", async () => {
    let response = await request.patch(`/requests/${documentID}`).send({ state: 0 });
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
