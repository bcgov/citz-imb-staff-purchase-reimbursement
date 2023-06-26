const { checkForCompleteRequest } = require('../../helpers/checkForCompleteRequest');

describe('Testing checkForCompleteRequest function', () => {
  const dataWithAllFields = {
    employeeId: 111111,
    purchases: [
      {
        fileObj: 'file1'
      },
      {
        fileObj: 'file2'
      }
    ],
    approvals: [
      {
        fileObj: 'file1'
      },
      {
        fileObj: 'file2'
      }
    ]
  };

  const missingEmployeeID = {
    purchases: [
      {
        fileObj: 'file1'
      },
      {
        fileObj: 'file2'
      }
    ],
    approvals: [
      {
        fileObj: 'file1'
      },
      {
        fileObj: 'file2'
      }
    ]
  };

  const purchaseFileMissing = {
    employeeId: 111111,
    purchases: [
      {
        notAPuchaseFile: 'no'
      },
      {
        fileObj: 'file2'
      }
    ],
    approvals: [
      {
        fileObj: 'file1'
      },
      {
        fileObj: 'file2'
      }
    ]
  };

  const noApprovals = {
    employeeId: 111111,
    purchases: [
      {
        fileObj: 'file1'
      },
      {
        fileObj: 'file2'
      }
    ],
    approvals: []
  };

  const approvalFileMissing = {
    employeeId: 111111,
    purchases: [
      {
        fileObj: 'file1'
      },
      {
        fileObj: 'file2'
      }
    ],
    approvals: [
      {
        notAFile: 'no'
      },
      {
        fileObj: 'file2'
      }
    ]
  };

  test('Func returns true if given data with all fields', () => {
    const result = checkForCompleteRequest(dataWithAllFields);
    expect(result).toBe(true);
  });

  test('Func returns false if the employee id is missing', () => {
    const result = checkForCompleteRequest(missingEmployeeID);
    expect(result).toBe(false);
  });

  test('Func returns false if any purchase file is missing', () => {
    const result = checkForCompleteRequest(purchaseFileMissing);
    expect(result).toBe(false);
  });

  test('Func returns false if approvals are missing', () => {
    const result = checkForCompleteRequest(noApprovals);
    expect(result).toBe(false);
  });

  test('Func returns false if any approval file is missing', () => {
    const result = checkForCompleteRequest(approvalFileMissing);
    expect(result).toBe(false);
  });
});
