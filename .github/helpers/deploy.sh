#!/bin/bash

# Processes DeploymentConfig files to assist with deployment to OpenShift.

oc process -f /home/runner/work/citz-imb-staff-purchasing-reimbursement/citz-imb-staff-purchasing-reimbursement/openshift/templates/$DEPLOYMENT_CONFIG --namespace=$OPENSHIFT_PROJECT \
    -p CONTAINER_NAME=$CONTAINER_NAME \
    -p OPENSHIFT_PROJECT=$OPENSHIFT_PROJECT \
    -p APPLICATION_NAME=$APPLICATION_NAME | \
    oc apply -f -
