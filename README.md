# CITZ IMB Staff Purchasing Reimbursement
Citizen Services Capstone Project A for 2023

## Setup
Create a `.env` file in the root of the project. Populate it with values for each key specified in `.env.template`. 

Example values
| KEY             | EXAMPLE   | DESCRIPTION                           |
| ---             | ---       | ---                                   |
| API_PORT        | 3004      | The port the API will listen on.      |
| HOSTNAME        | localhost | The hostname for the API.             |
| MONGO_PORT      | 27017     | The port used by MongoDB.             |
| MONGO_USERNAME  | username  | The root admin name for MongoDB.      |
| MONGO_PASSWORD  | password  | The root admin password for MongoDB.  |
| MONGO_DATABASE  | my-db     | The database name for MongoDB.        |

## Running
This project assumes that you have Docker installed on your system. If not, please install it first.

[Docker](https://www.docker.com/)

To start the entire application, run the following command: 

`docker-compose up -d`.

To stop the entire application, run the following:

`docker-compose down`
