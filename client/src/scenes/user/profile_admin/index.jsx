import React from 'react';

import { propTypes as dAProps } from '../../../data/discipline_action';
import { propTypes as performanceProps } from '../../../data/performance';
import { helpers, propTypes as userProps } from '../../../data/user';
import { fetch } from '../../../utils';
import { CreateDisciplineAction, PastDisciplineAction } from '../../../components/discipline_action';
import { DoneChallenge } from '../../../components/challenge';
import Elevation from '../../../components/elevation';
import { FlexChild, FlexContainer } from '../../../components/flex';
import { ListDropdownSeparator } from '../../../components/list_dropdown';
import UserHeader from '../../../components/user_header';

class Profile extends React.PureComponent {
  static get propTypes() {
    return {
      disciplineActions: React.PropTypes.arrayOf(React.PropTypes.shape(dAProps)),
      performance: React.PropTypes.shape(performanceProps.performance),
      user: React.PropTypes.shape(userProps)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      disciplineActions: [...props.disciplineActions]
    };
    this.handleDACreate = this.handleDACreate.bind(this);
    this.handleDADelete = this.handleDADelete.bind(this);
  }

  handleDACreate(da) {
    this.setState(({ disciplineActions }) => ({
      disciplineActions: [...disciplineActions, da]
    }));
  }

  handleDADelete() {
    this.setState(({ disciplineActions }) => {
      const newDAS = [...disciplineActions];

      newDAS.pop();
      return { disciplineActions: newDAS };
    });
  }

  render() {
    const { disciplineActions } = this.state;
    const { performance, user } = this.props;
    const showCreateDisciplineAction =
      Boolean(performance) &&
      disciplineActions.length <= 0 ||
      (
        disciplineActions.length >= 1 &&
        disciplineActions[disciplineActions.length - 1].performance.id !== performance.id
      )
    ;

    return (
      <FlexContainer flexDirection="column" alignItems="center" justifyContent="center">
        <UserHeader {...user} />
        <FlexContainer flexWrap="wrap" justifyContent="space-between" width="95%">
          <FlexChild flex="1">
            <Elevation>
              {showCreateDisciplineAction && <CreateDisciplineAction user={user} onCreate={this.handleDACreate} />}
              {disciplineActions.map(da => (
                <div key={da.id}>
                  <PastDisciplineAction {...da} currentPerformance={performance} user={user} onDelete={this.handleDADelete} />
                  <ListDropdownSeparator />
                </div>
              ))}
            </Elevation>
          </FlexChild>
          <FlexChild flex="1">
            <DoneChallenge />
          </FlexChild>
        </FlexContainer>
      </FlexContainer>
    );
  }
}

const ProfileAdmin = ({ match }) => fetch(() => helpers.getByBuckId(match.params.buckId), null, Profile)();

export default ProfileAdmin;
