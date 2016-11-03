import React from 'react';
import { stringify } from 'query-string';

const newTokenForOrgLink = (props) => {
  // Note: `[]` is appended to array items as Ruby and 'query-string' deal with arrays differently
  const query = {
    'account_ids[]': [
      props.organization.id
    ],
    'account_scope': 'some',
    'description': `Elastic CI Stack (${ props.organization.name })`,
    'return_to': `/organizations/${ props.organization.slug }/agents#setup-aws`,
    'scopes[]': [
      'read_agents',
      'read_builds',
      'read_pipelines'
    ],
    'template': 'elastic_ci_aws'
  };

  return `/user/api-access-tokens/new?${stringify(query)}`
};

const AWSTableRow = (props) => (
  <tr>
    <th className="p1 left-align align-top border-bottom border-gray">
      <strong>{props.title}</strong>
    </th>
    <td className="p1 left-align align-top border-bottom border-gray">
      {props.children}
    </td>
  </tr>
);

export default function AWSParameterTable(props) {
  return (
    <table className="border-top border-gray">
      <tbody>
        <AWSTableRow title="BuildkiteAgentToken">
          <code className="monospace" style={{ fontSize: '.85em' }}>
            {props.token || 'INSERT-YOUR-AGENT-TOKEN-HERE'}
          </code>
        </AWSTableRow>
        <AWSTableRow title="BuildkiteOrgSlug">
          <code className="monospace" style={{ fontSize: '.85em' }}>
            {props.organization.slug || 'INSERT-YOUR-ACCOUNT-SLUG-HERE'}
          </code>
        </AWSTableRow>
        <AWSTableRow title="BuildkiteApiAccessToken">
          {
            props.apiAccessTokens.map((token, index) => (
              <div key={index} className="mb1 pb1 border-bottom border-gray">
                <code className="monospace" style={{ fontSize: '.85em' }}>
                  {token.token}
                </code>
                <br />
                <small>
                  <a href={`/user/api-access-tokens/${ token.uuid }/edit`} className="blue hover-navy text-decoration-none hover-underline">
                    {token.description}
                  </a>
                </small>
              </div>
            ))
          }
          <a href={newTokenForOrgLink(props)} className="blue hover-navy text-decoration-none hover-underline">
            <small>
              Create an{ props.apiAccessTokens.length ? 'other' : '' } API Access Token
            </small>
          </a>
        </AWSTableRow>
      </tbody>
    </table>
  );
}
