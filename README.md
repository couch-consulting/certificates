# Certificates
-- A YoloCode solution --
[![Build Status](https://travis-ci.org/couch-consulting/certificates.svg?branch=master)](https://travis-ci.org/couch-consulting/certificates)

## Running
To run this application a Cloudant Instance is required. A lite plan is sufficient. To connect either deploy the application to CloudFoundry and use the VCAP connections between the database and the service or set the environment variable `DATABASE`with the json of jour database credentials. If both environment variables are unset the application will exit.
