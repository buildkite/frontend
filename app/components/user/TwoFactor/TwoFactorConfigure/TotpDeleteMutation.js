// @flow

import { graphql, commitMutation } from 'react-relay/compat';
import type { Environment as RelayEnvironment } from 'react-relay';
import type { TotpDeleteMutationMutationVariables, TotpDeleteMutationMutationResponse } from './__generated__/TotpCreateMutation.graphql';

type MutationParams = {
  environment: RelayEnvironment,
  onCompleted?: (response: TotpDeleteMutationMutationResponse) => *,
  onError?: () => void,
  variables?: TotpDeleteMutationMutationVariables
};

export default function TotpDeleteMutation({ environment, variables }: MutationParams): void {
  commitMutation(
    environment,
    {
      mutation: graphql`
        mutation TotpDeleteMutationMutation($input: TOTPDeleteInput!) {
          totpDelete(input: $input) {
            clientMutationId
          }
        }
      `,
      variables
    }
  );
}
