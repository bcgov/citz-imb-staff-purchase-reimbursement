# CITZ IMB Staff Purchasing Reimbursement
Citizen Services Capstone Project A for 2023

## Setup
Create a `.env` file in the root of the project. Populate it with values for each key specified in `.env.template`. 

### Example values
| KEY                   | EXAMPLE       | DESCRIPTION                                                 |
| ---                   | ---           | ---                                                         |
| API_PORT              | 3004          | The port the API will listen on.                            |
| MONGO_PORT            | 27017         | The port used by MongoDB.                                   |
| MONGO_USERNAME        | username      | The root admin name for MongoDB.                            |
| MONGO_PASSWORD        | password      | The root admin password for MongoDB.                        |
| MONGO_DATABASE        | my-db         | The database name for MongoDB.                              |
| MONGO_SERVICE         | mongo         | Prod only. The name of the Docker service for MongoDB.      |
| ENVIRONMENT           | local         | Keycloak. Local only. Set to local when running locally.    |
| FRONTEND_PORT         | 8080          | Keycloak. Local only. The port of the frontend application. |
| FRONTEND_URL          | https://...   | Keycloak. Production only. URL of frontend application.     |
| BACKEND_URL           | https://...   | Keycloak. Production only. URL of backend application.      |
| SSO_CLIENT_ID         | my-id-1234    | Keycloak. Client ID.                                        |
| SSO_CLIENT_SECRET     | somesecret    | Keycloak. Client secret.                                    |
| SSO_AUTH_SERVER_URL   | https://...   | Keycloak. Authorization URL.                                |
| GC_NOTIFY_API_KEY     | somesecret    | API Key for GC Notify.                                      |
| GC_NOTIFY_ADMIN_EMAIL | bob@gmail.com | Email address for admin mailbox.                            |
| TESTING               | true          | Disables Keycloak for API testing.                          |

## Running
This project assumes that you have Docker installed on your system. If not, please install it first.

[Docker](https://www.docker.com/)

To start the entire application, run the following command: 

`docker-compose up -d`.

To stop the entire application, run the following:

`docker-compose down`
