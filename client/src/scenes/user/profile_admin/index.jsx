import React from 'react';

import { propTypes as challengeProps } from '../../../data/challenge';
import { propTypes as dAProps } from '../../../data/discipline_action';
import { propTypes as performanceProps } from '../../../data/performance';
import { helpers, propTypes as userProps } from '../../../data/user';
import { fetch } from '../../../utils';
import { CreateDisciplineAction, PastDisciplineAction } from '../../../components/discipline_action';
import { CurrentChallengeAdmin, DoneChallenge } from '../../../components/challenge';
import Elevation from '../../../components/elevation';
import { FlexChild, FlexContainer } from '../../../components/flex';
import { ListDropdownSeparator } from '../../../components/list_dropdown';
import UserHeader from '../../../components/user_header';

class Profile extends React.PureComponent {
  static get propTypes() {
    return {
      currentChallenge: React.PropTypes.shape(challengeProps),
      disciplineActions: React.PropTypes.arrayOf(React.PropTypes.shape(dAProps)),
      pastChallenges: React.PropTypes.arrayOf(React.PropTypes.shape(challengeProps)),
      performance: React.PropTypes.shape(performanceProps.performance),
      user: React.PropTypes.shape(userProps)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      currentChallenge: props.currentChallenge,
      disciplineActions: [...props.disciplineActions]
    };
    this.handleCurrentChallengeDelete = this.handleCurrentChallengeDelete.bind(this);
    this.handleDACreate = this.handleDACreate.bind(this);
    this.handleDADelete = this.handleDADelete.bind(this);
  }

  handleCurrentChallengeDelete() {
    this.setState({ currentChallenge: null });
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
    const { currentChallenge, disciplineActions } = this.state;
    const { pastChallenges, performance, user } = this.props;
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
          {(showCreateDisciplineAction || disciplineActions.length > 0) &&
            <FlexChild flex="1" minWidth="350px" margin="0 10px">
              <Elevation>
                {showCreateDisciplineAction &&
                  <FlexChild padding="10px">
                    <CreateDisciplineAction user={user} onCreate={this.handleDACreate} />
                  </FlexChild>
                }
                {disciplineActions.map(da => (
                  <div key={da.id}>
                    <PastDisciplineAction {...da} currentPerformance={performance} user={user} onDelete={this.handleDADelete} />
                    <ListDropdownSeparator />
                  </div>
                ))}
              </Elevation>
            </FlexChild>
          }
          {(Boolean(currentChallenge) || pastChallenges.length > 0) &&
            <FlexChild flex="1" minWidth="350px" margin="0 10px">
              <Elevation>
                {currentChallenge &&
                  <FlexChild padding="10px">
                    <CurrentChallengeAdmin
                      {...currentChallenge}
                      onDelete={this.handleCurrentChallengeDelete}
                      targetUserBuckId={user.buckId}
                    />
                    <ListDropdownSeparator />
                  </FlexChild>
                }
                {pastChallenges.map(c => (
                  <FlexContainer key={c.id} padding="10px">
                    <DoneChallenge {...c} targetUserBuckId={user.buckId} />
                    <ListDropdownSeparator />
                  </FlexContainer>
                ))}
              </Elevation>
            </FlexChild>
          }
        </FlexContainer>
      </FlexContainer>
    );
  }
}

const ProfileAdmin = ({ match }) => fetch(() => helpers.getByBuckId(match.params.buckId), null, Profile)();

export default ProfileAdmin;
