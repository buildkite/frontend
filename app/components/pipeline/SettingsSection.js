import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import PageWithContainer from '../shared/PageWithContainer';
import Panel from '../shared/Panel';
import Emojify from '../shared/Emojify';
import Icon from '../shared/Icon';

class SettingsSection extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  };

  render() {
    let pipeline = this.props.pipeline;
    let organization = this.props.pipeline.organization;

    return (
      <PageWithContainer>
        <Panel>
          <Panel.Section>
            <div className="flex items-center justify-center">
              <Link to={`/${organization.slug}/${pipeline.slug}/settings`} className="btn hover-bg-silver hover-black focus-black center">
                <Emojify text=":pipeline:" className="block mb1" />
                Pipeline
              </Link>
              <Link to={`/${organization.slug}/${pipeline.slug}/settings/pipeline`} className="btn hover-bg-silver hover-black focus-black center">
                <div className="block mb1">
                  <Icon icon="settings" />
                </div>
                Settings
              </Link>
              <Link to={`/${organization.slug}/${pipeline.slug}/settings/github`} className="btn hover-bg-silver hover-black focus-black center">
                <div className="block mb1">
                  <Emojify text=":checkered_flag:" className="block mb1" />
                </div>
                Queueing
              </Link>
              <Link to={`/${organization.slug}/${pipeline.slug}/settings/github`} className="btn hover-bg-silver hover-black focus-black center">
                <div className="block mb1">
                  <Icon icon="github" />
                </div>
                GitHub
              </Link>
              <Link to={`/${organization.slug}/${pipeline.slug}/settings/schedules`} className="btn hover-bg-silver hover-black focus-black center">
                <Emojify text=":timer_clock:" className="block mb1" />
                Scheduels
              </Link>
              <Link to={`/${organization.slug}/${pipeline.slug}/settings/github`} className="btn hover-bg-silver hover-black focus-black center">
                <div className="block mb1">
                  <Emojify text=":label:" className="block mb1" />
                </div>
                Badges
              </Link>
            </div>
          </Panel.Section>

          {this.props.children}
        </Panel>
      </PageWithContainer>
    );
  }
}

export default Relay.createContainer(SettingsSection, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        name
        slug
        organization {
          slug
        }
      }
    `
  }
});
