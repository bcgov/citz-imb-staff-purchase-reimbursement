#!/bin/bash

# Processes DeploymentConfig files to assist with deployment to OpenShift.

oc process -f /home/runner/work/citz-imb-staff-purchasing-reimbursement/citz-imb-staff-purchasing-reimbursement/openshift/templates/$DEPLOYMENT_CONFIG --namespace=$OPENSHIFT_NAMESPACE \
    -p CONTAINER_NAME=$CONTAINER_NAME \
    -p OPENSHIFT_NAMESPACE=$OPENSHIFT_NAMESPACE \
    -p APPLICATION_NAME=$APPLICATION_NAME \
    -p ARTIFACTORY_URL=$ARTIFACTORY_URL \
    -p IMAGE_REPOSITORY=$IMAGE_REPOSITORY | \
    oc apply -f -
