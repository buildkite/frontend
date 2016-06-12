import Relay from 'react-relay';
import RelayQuery from 'react-relay/lib/RelayQuery';
import RelayMetaRoute from 'react-relay/lib/RelayMetaRoute';

let PusherStore = require("./stores/PusherStore").default;

const build = Relay.QL`
 fragment on Build {
   id
   pipeline {
     id
     name
   },
   user {
     id
     name
     avatar {
       url
     }
   }
   url
   number
   state
   message
   branch
   commit
   startedAt
   finishedAt
 }
`

const ql = Relay.QL`
  mutation($id: ID!, $clientMutationId: String!) {
    faux(input: { clientMutationId: $clientMutationId, id: $id }) {
      clientMutationId

      build {
        ${build}
      }

      buildEdge {
        node {
          ${build}
        }
      }
    }
  }
`

function callback(event, build) {
  let clientMutationId = new Date().toString();

  let query = RelayQuery.Operation.create(ql,
                                          RelayMetaRoute.get('$faux'),
                                          { id: build.id, clientMutationId: clientMutationId });

  let payload = {
    clientMutationId: clientMutationId,
    build: build,
    buildEdge: {
      __typename: "BuildEdge",
      node: build
    }
  };

  let states = {
    "BUILD_STATE_SKIPPED": "skipped",
    "BUILD_STATE_SCHEDULED": "scheduled",
    "BUILD_STATE_RUNNING": "running",
    "BUILD_STATE_PASSED": "passed",
    "BUILD_STATE_FAILED": "failed",
    "BUILD_STATE_CANCELING": "canceling",
    "BUILD_STATE_CANCELED": "canceled"
  }

  //let prependState = function(states) {
  //  if(states.indexOf("BUILD_STATE_SCHEDULED") >= 0) {
  //    return "scheduled";
  //  } else if(states.indexOf("BUILD_STATE_RUNNING") >= 0) {
  //    return "running";
  //  }
  //}

  Relay.Store.getStoreData().handleUpdatePayload(query, payload, {
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          build: build.id,
        },
      },
      {
        type: 'RANGE_ADD',
        parentName: 'pipeline',
        parentID: build.pipeline.id,
        connectionName: 'builds',
        edgeName: 'buildEdge',
        rangeBehaviors: (rangeFilterCalls) => {
          if(rangeFilterCalls.state) {

            // When a build is scheduled, only `prepend` if the states include `BUILD_STATE_SCHEDULED` or there are no states
            // When a build is skipped, only `prepend` if the states include `BUILD_STATE_SKIPPED` or there are no states

            // When a build starts, only `prepend` if the states include `BUILD_STATE_RUNNING`
            // When a build finishes, only `prepend` if the states include `BUILD_STATE_PASSED`, `BUILD_STATE_FAILED` or `BUILD_STATE_CANCELED`


            return 'ignore';
          } else {
            return 'ignore';
          }
        }
      }
    ],
    isOptimisticUpdate: false
  });
}

PusherStore.on("build:create", function(build) { callback("create", build) });
PusherStore.on("build:change", function(build) { callback("change", build) });
