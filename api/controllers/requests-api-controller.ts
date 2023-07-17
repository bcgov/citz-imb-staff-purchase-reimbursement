import db from '../db/conn';
import { Request, Response } from 'express';
import { Collection, WithId, ObjectId, Filter } from 'mongodb';
import RequestStates from '../constants/RequestStates';
import { z } from 'zod';
import { checkForCompleteRequest } from '../helpers/checkForCompleteRequest';
import { User, getUserInfo } from '../keycloak/utils';
import Constants from '../constants/Constants';
import { Purchase } from '../interfaces/Purchase';
import { Approval } from '../interfaces/Approval';
import JSZip from 'jszip';
import { IFile } from '../interfaces/IFile';
import { sendChangeNotification, sendRequestSubmittedNotification } from '../helpers/useGCNotify';
import { getIDIRUser, IDIRUser } from '../helpers/useCssApi';

// All functions use requests collection
const collection: Collection<RequestRecord> = db.collection<RequestRecord>('requests');

// Schema to check for document id when coming in as url params
const idSchema = z.string().length(24);

/**
 * @interface
 * @description The expected request stored in the 'requests' collection
 * @property {ObjectId}       _id             - The unique ID of a request record.
 * @property {boolean}        lateEntry       - Supplied by CHEFS. Only important if the CHEFS form has a due date.
 * @property {string}         firstName       - The first name of the requestor.
 * @property {string}         lastName        - The last name of the requestor.
 * @property {number}         employeeId      - The requestor's employee ID.
 * @property {string}         idir            - The requestor's IDIR code.
 * @property {Array}          purchases       - A list of Purchase items.
 * @property {Array}          approvals       - A list of Approval items.
 * @property {boolean}        submit          - Supplied by CHEFS. True if submitted. Only important if CHEFS stores drafts.
 * @property {string}         submissionDate  - The date of the reimbursement submission.
 * @property {RequestStates}  state           - The current state of the request.
 */
export interface RequestRecord {
  _id: ObjectId;
  lateEntry: boolean;
  firstName: string;
  lastName: string;
  employeeId: number;
  idir: string;
  purchases: Purchase[];
  approvals: Approval[];
  additionalComments: string;
  submit: boolean;
  submissionDate: string;
  state: RequestStates;
}

/**
 * @constant
 * @description Allows for a reduced version of each document to be returned from Mongo. A true or 1 signifies that property will be included.
 */
const minimalProjection = {
  firstName: 1,
  lastName: 1,
  'purchases.cost': 1, // Format for getting specific properties of objects in an array
  'purchases.supplier': 1,
  submissionDate: 1,
  state: 1,
};

/**
 * @description Gets all request records. Includes an option to retrieve records with projection.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with array of records or 404 if no records are found.
 */
export const getAllRequests = async (req: Request, res: Response) => {
  const { minimal, before, after } = req.query;
  const latestPossibleDate = '3000-01-01';
  const earliestPossibleDate = '1970-01-01';
  // Query will filter out by date, but only if provided.
  const findQuery: Filter<RequestRecord> = {
    submissionDate: {
      $gte: (after as string) || earliestPossibleDate,
      $lt: (before as string) || latestPossibleDate,
    },
  };

  try {
    const cursor =
      minimal === 'true'
        ? collection.find(findQuery).sort({ submissionDate: -1 }).project(minimalProjection)
        : collection.find(findQuery).sort({ submissionDate: -1 });
    const records = await cursor.toArray();
    // If there are no records.
    if (records.length === 0) {
      return res.status(404).send('No records found');
    }
    // If records are found.
    if (records) {
      return res.status(200).json(records);
    }
  } catch (e) {
    console.warn(e);
    // Error response
    return res.status(400).send('Request could not be processed.');
  }
};

/**
 * @description Get any request records matching a specific IDIR GUID. Includes an option to retrieve records with projection.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with array of records or 404 if no records are found.
 */
export const getRequestsByIDIR = async (req: Request, res: Response) => {
  const { minimal, idir } = req.query;
  const { TESTING } = Constants;

  if (!TESTING) {
    // If neither the IDIR matches nor the user is admin, return the 403
    const userInfo = getUserInfo(req.headers.authorization.split(' ')[1]); // Excludes the 'Bearer' part of token.
    const idirMatches = userInfo.idir_user_guid === idir;
    const isAdmin = userInfo.client_roles?.includes('admin');
    if (!idirMatches && !isAdmin)
      return res.status(403).send('Forbidden: User does not match requested IDIR.');
  }

  try {
    const cursor =
      minimal === 'true'
        ? collection
            .find({ idir: { $eq: idir as string } })
            .sort({ submissionDate: -1 })
            .project(minimalProjection)
        : collection.find({ idir: { $eq: idir as string } }).sort({ submissionDate: -1 });
    const records = await cursor.toArray();

    // If there are no records.
    if (records.length === 0) {
      return res.status(404).send('No records found');
    }

    // If records are found.
    if (records) {
      return res.status(200).json(records);
    }
  } catch (e) {
    console.warn(e);
    // Error response
    return res.status(400).send('Request could not be processed.');
  }
};

/**
 * @description Get a single request record by ID. Includes an option to retrieve records with projection.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with array of records or 404 if no records are found.
 */
export const getRequestByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { TESTING } = Constants;

  // Projection to get everything except a file's data
  const noFileProjection = {
    'purchases.fileObj.file': 0,
  };

  // If ID doesn't match schema, return a 400
  try {
    idSchema.parse(id);
  } catch (e) {
    return res.status(400).send('ID was malformed. Cannot complete request.');
  }

  try {
    const record: WithId<RequestRecord> = await collection.findOne(
      {
        _id: { $eq: new ObjectId(id) },
      },
      {
        projection: noFileProjection,
      },
    );
    if (!record) {
      return res.status(404).send('No record with that ID found.');
    }
    if (record) {
      if (!TESTING) {
        // If neither the IDIR matches nor the user is admin, return the 403
        const userInfo = getUserInfo(req.headers.authorization.split(' ')[1]); // Excludes the 'Bearer' part of token.
        const idirMatches = userInfo.idir_user_guid === record.idir;
        const isAdmin = userInfo.client_roles?.includes('admin');
        if (!idirMatches && !isAdmin)
          return res.status(403).send('Forbidden: User does not match requested record.');
      }
      return res.status(200).json(record);
    }
  } catch (e) {
    console.warn(e);
    // Error response
    return res.status(400).send('Request could not be processed.');
  }
};

/**
 * @description Updates the state of a specific request record. Also functions as the soft-delete option.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with a string indicating updated status.
 */
export const updateRequestState = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { employeeId, purchases, approvals, additionalComments, state, isAdmin } = req.body;
  const { TESTING, FRONTEND_URL } = Constants;
  const { GC_NOTIFY_ADMIN_EMAIL } = process.env;

  // If ID doesn't match schema, return a 400
  try {
    idSchema.parse(id);
  } catch (e) {
    return res.status(400).send('ID was malformed. Cannot complete request.');
  }

  // Establish the id that is used to find document
  const filter = { _id: { $eq: new ObjectId(id) } };

  // Check that state is a valid option
  if (state < 0 || state >= RequestStates.__LENGTH)
    return res.status(403).send('An invalid state was requested.');

  // Get previous state of request
  const existingRequest: WithId<RequestRecord> = await collection.findOne(filter);

  if (!TESTING && existingRequest) {
    // If neither the IDIR matches nor the user is admin, return the 403
    const userInfo = getUserInfo(req.headers.authorization.split(' ')[1]); // Excludes the 'Bearer' part of token.
    const idirMatches = userInfo.idir_user_guid === existingRequest.idir;
    if (!idirMatches && !isAdmin)
      return res.status(403).send('Forbidden: User does not match requested record.');
  }

  let refinedState = state;

  // If user isn't an admin, take control of the state update
  if (!isAdmin) {
    // If request has all required fields and files
    if (checkForCompleteRequest({ employeeId, purchases, approvals })) {
      // If previous state was Incomplete, change it to Submitted
      if (existingRequest.state === RequestStates.INCOMPLETE) {
        refinedState = RequestStates.SUBMITTED;
        sendRequestSubmittedNotification(
          GC_NOTIFY_ADMIN_EMAIL,
          `${FRONTEND_URL}/request/${existingRequest._id}`,
        );
      }
    } else {
      // Otherwise, submission should be marked as Incomplete
      refinedState = RequestStates.INCOMPLETE;
    }
  } else {
    // User is admin
    // If the state is changed by admin to Incomplete or Complete, notify requestor
    if (refinedState === RequestStates.INCOMPLETE || refinedState === RequestStates.COMPLETE) {
      // Get user with matching IDIR
      const users: IDIRUser[] = await getIDIRUser(existingRequest.idir);
      if (users.length > 0) {
        sendChangeNotification(users.at(0).email, `${FRONTEND_URL}/request/${id}`);
      }
    }
  }

  /**
   * @description Determines whether the records need to update their files.
   * @param {Purchase[] | Approval[]} records A list of records that contain fileObj properties.
   * @returns A list of records that has updated file information.
   */
  const recordRefiner = (records: Purchase[] | Approval[]) =>
    records
      ? records.map((record: unknown, index: number) => {
          // Determine the type of records provided.
          const listType = (record as Purchase).supplier ? 'purchase' : 'approval';
          // Get the existing list of records
          const existingList: Purchase[] | Approval[] =
            listType === 'purchase' ? existingRequest.purchases : existingRequest.approvals;
          // A mutable record copy
          const tempRecord =
            listType === 'purchase' ? { ...(record as Purchase) } : { ...(record as Approval) };
          if (tempRecord.fileObj && tempRecord.fileObj.file) {
            // New file incoming. Replace original.
            return tempRecord;
          } else if (existingList[index] && existingList[index].fileObj) {
            // File exists on original, but not on incoming request
            if (tempRecord.fileObj && tempRecord.fileObj.removed) {
              // File has since been removed by the user
              delete tempRecord.fileObj;
              return tempRecord;
            } else {
              // File was not included for bandwidth reasons. Keep original.
              tempRecord.fileObj.file = existingList[index].fileObj.file;
              return tempRecord;
            }
          } else {
            // No incoming new file, and original didn't have file either. Don't include file info.
            // Need to still update info from purchase
            delete tempRecord.fileObj;
            return tempRecord;
          }
        })
      : [];

  const refinedPurchases: unknown = recordRefiner(purchases);
  const refinedApprovals: unknown = recordRefiner(approvals);

  // Create setting object
  const newProperties = {
    approvals: refinedApprovals as Approval[],
    additionalComments: additionalComments || existingRequest?.additionalComments || '',
    purchases: refinedPurchases as Purchase[],
    employeeId: employeeId || existingRequest?.employeeId || 999999,
    state:
      refinedState === undefined || refinedState === null ? existingRequest.state : refinedState,
  };

  // Update the document
  const updateDoc = {
    $set: newProperties,
  };

  try {
    const result = await collection.updateOne(filter, updateDoc);
    // If no records matched that ID
    if (result.matchedCount === 0) return res.status(404).send('No matching record found.');
    // Else, return the updated result
    return res.status(200).send(`Request state updated to ${RequestStates[state]}.`);
  } catch (e) {
    console.warn(e);
    return res.status(400).send('Request could not be processed.');
  }
};

/**
 * @description Gets all files associated with a record or a single requested file based on record ID and file upload timestamp
 * @param {Request} req The incoming request.
 * @param {Response} res The returned response.
 * @returns A response with the attached base64 files in the body.
 */
export const getFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date } = req.query;
  const { TESTING } = Constants;

  interface FilesRecord {
    idir: string;
    purchases: Purchase[];
    approvals: Approval[];
  }

  // Projection to get only the file's data
  const onlyFileProjection = {
    idir: 1,
    'purchases.fileObj': 1,
    'approvals.fileObj': 1,
  };

  // If ID doesn't match schema, return a 400
  try {
    idSchema.parse(id);
  } catch (e) {
    return res.status(400).send('ID was malformed. Cannot complete request.');
  }

  try {
    // Get all files from that record
    const record: WithId<FilesRecord> = await collection.findOne(
      {
        _id: { $eq: new ObjectId(id) },
      },
      {
        projection: onlyFileProjection,
      },
    );

    // Return 404 if that record didn't exist
    if (!record) {
      return res.status(404).send('No record with that ID found.');
    } else {
      if (!TESTING) {
        // If neither the IDIR matches nor the user is admin, return the 403
        const userInfo = getUserInfo(req.headers.authorization.split(' ')[1]); // Excludes the 'Bearer' part of token.
        const idirMatches = userInfo.idir_user_guid === record.idir;
        const isAdmin = userInfo.client_roles?.includes('admin');
        if (!idirMatches && !isAdmin)
          return res.status(403).send('Forbidden: User does not match requested record.');
      }

      // Flat map files
      const allFiles = [...record.purchases, ...record.approvals].map((el) => el.fileObj);
      if (date) {
        // Select only the file with the matching date
        const desiredFile = allFiles.find((fileObj) => fileObj && fileObj.date === date);
        // Return 404 if no files were returned
        if (!desiredFile) {
          return res.status(404).send('No file matches that request.');
        }

        // Update file to be marked as downloaded.
        const { user } = req;
        if ((user as User).client_roles?.includes('admin')) {
          if (desiredFile.source === 'purchase') {
            await collection.updateOne(
              {
                _id: { $eq: new ObjectId(id) },
                'purchases.fileObj.date': date,
              },
              {
                $set: {
                  'purchases.$.fileObj.downloaded': true,
                },
              },
            );
          } else {
            await collection.updateOne(
              {
                _id: { $eq: new ObjectId(id) },
                'approvals.fileObj.date': date,
              },
              {
                $set: {
                  'approvals.$.fileObj.downloaded': true,
                },
              },
            );
          }
        }

        return res.status(200).json({ file: desiredFile.file });
      } else {
        // No date? Return all files
        // If any files are undefined (missing purchase or approvals), remove them.
        // Remove any deleted files
        const trimmedFiles = allFiles.filter((fileObj) => fileObj && !fileObj.deleted);

        // Zip the files together
        const zip = new JSZip();
        trimmedFiles.forEach((fileObj: IFile) => {
          // Only need the base64 hash, not declaritive info
          zip.file(fileObj.name, fileObj.file.split('base64,')[1], {
            base64: true, // must specify files are base64
          });
        });
        // Creates the zip folder (as base64), then sends with appropriate declarative info
        zip.generateAsync({ type: 'base64' }).then((content: string) => {
          res.status(200).json({ zip: `data:application/zip;base64,${content}` });
        });

        const { user } = req;
        if ((user as User).client_roles?.includes('admin')) {
          // Mark all files as downloaded.
          await collection.updateOne(
            {
              _id: { $eq: new ObjectId(id) },
            },
            {
              $set: {
                'purchases.$[].fileObj.downloaded': true,
                'approvals.$[].fileObj.downloaded': true,
              },
            },
          );
        }

        return res;
      }
    }
  } catch (e) {
    console.warn(e);
    // Error response
    return res.status(400).send('Request could not be processed.');
  }
};
