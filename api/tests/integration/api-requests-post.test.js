const endpoint = `http://${process.env.HOSTNAME}:${process.env.API_PORT}/api`;
const supertest = require('supertest')

const request = supertest(endpoint);

describe("Testing POST route for /requests endpoint", () => {
  test("API returns code 201 on successful submission", async () => {
    const response = await request.post("/requests").send({
      data: {
        lateEntry: false,
        firstName: "John",
        lastName: "Smith",
        employeeId: 234567,
        itemsPurchased: [
          "Dogs"
        ],
        totalCost: 45.46,
        purchaseDate: "2023-04-05T00:00:00-07:00",
        attachReceipts: [
          {}
        ],
        approvalDate: "2023-04-13T00:00:00-07:00",
        attachApproval: [
          {}
        ],
        supplierName: "Jimmy's Dogs",
        supplierPhoneNumber: "(324) 324-2342",
        supplierEmail: "jimmys@yahoo.com",
        additionalComments: "Great purchase!",
        submit: true,
      }
    });
    expect(response.ok).toBe(true);
    expect(response.status).toBe(201);
    // id should have been created
    expect(response.body._id).toBeTruthy();
  });
});
