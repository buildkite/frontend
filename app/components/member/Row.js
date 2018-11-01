// @flow

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Panel from 'app/components/shared/Panel';
import UserAvatar from 'app/components/shared/UserAvatar';
import Badge from 'app/components/shared/Badge';
import OrganizationMemberRoleConstants from 'app/constants/OrganizationMemberRoleConstants';
import OrganizationMemberSSOModeConstants from 'app/constants/OrganizationMemberSSOModeConstants';
import type { Row_organization } from './__generated__/Row_organization.graphql';
import type { Row_organizationMember } from './__generated__/Row_organizationMember.graphql';

const AVATAR_SIZE = 40;

type Props = {
  organization: Row_organization,
  organizationMember: Row_organizationMember
};

class MemberRow extends React.PureComponent<Props> {
  render() {
    return (
      <Panel.RowLink
        key={this.props.organizationMember.uuid}
        to={`/organizations/${this.props.organization.slug}/users/${this.props.organizationMember.uuid}`}
      >
        <div className="flex flex-stretch items-center">
          <div className="flex flex-none mr2">
            <UserAvatar
              user={this.props.organizationMember.user}
              className="align-middle"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            />
          </div>
          <div className="flex-auto">
            <div className="m0 flex items-center semi-bold">
              {this.props.organizationMember.user
                ? this.props.organizationMember.user.name
                : ''
              }
              {this.renderLabels()}
            </div>
            {this.props.organizationMember.user
              ? <div className="h6 regular mt1">{this.props.organizationMember.user.email}</div>
              : ''
            }
          </div>
        </div>
      </Panel.RowLink>
    );
  }

  renderLabels() {
    const nodes = [];

    if (this.props.organizationMember.sso.mode === OrganizationMemberSSOModeConstants.OPTIONAL) {
      nodes.push(
        <div key="sso" className="flex ml1">
          <Badge outline={true} className="regular">SSO Optional</Badge>
        </div>
      );
    }

    if (this.props.organizationMember.role === OrganizationMemberRoleConstants.ADMIN) {
      nodes.push(
        <div key="admin" className="flex ml1">
          <Badge outline={true} className="regular">Administrator</Badge>
        </div>
      );
    }

    if (this.props.organizationMember.security.twoFactorEnabled) {
      nodes.push(
        <div key="2fa" className="flex ml1">
          <Badge
            title="Two-factor authentication is configured."
            outline={true}
            className="border-lime lime"
          >
            2FA
          </Badge>
        </div>
      );
    }

    return nodes;
  }
}

export default createFragmentContainer(
  MemberRow,
  graphql`
    fragment Row_organization on Organization {
      slug
    }
    fragment Row_organizationMember on OrganizationMember {
      uuid
      role
      sso {
        mode
      }
      security {
        twoFactorEnabled
      }
      user {
        name
        email
        avatar {
          url
        }
      }
    }
  `
);