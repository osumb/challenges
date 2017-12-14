import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { helpers as spotHelpers } from '../../../data/spot';
import { helpers as userHelpers } from '../../../data/user';
import Button from '../../../components/button';
import ConfirmStage from './components/confirm_stage';
import Elevation from '../../../components/elevation';
import EmailStage from './components/email_stage';
import InstrumentStage from './components/instrument_stage';
import NameStage from './components/name_stage';
import RoleSpotStage from './components/role_spot_stage';
import Typography from '../../../components/typography';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
const StageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 8px;
`;
const linkStyle = {
  color: 'white'
};

const NAME_STAGE_PATH = 'names';
const EMAIL_STAGE_PATH = 'email';
const ROLE_SPOT_STAGE_PATH = 'role';
const INSTRUMENT_STAGE_PATH = 'instrument';
const CONFIRM_STAGE_PATH = 'confirm';

const NEXT_ROUTE = {
  [NAME_STAGE_PATH]: EMAIL_STAGE_PATH,
  [EMAIL_STAGE_PATH]: ROLE_SPOT_STAGE_PATH,
  [ROLE_SPOT_STAGE_PATH]: INSTRUMENT_STAGE_PATH,
  [INSTRUMENT_STAGE_PATH]: CONFIRM_STAGE_PATH,
  [CONFIRM_STAGE_PATH]: NAME_STAGE_PATH
};
const PREVIOUS_ROUTE = {
  [EMAIL_STAGE_PATH]: NAME_STAGE_PATH,
  [ROLE_SPOT_STAGE_PATH]: EMAIL_STAGE_PATH,
  [INSTRUMENT_STAGE_PATH]: ROLE_SPOT_STAGE_PATH,
  [CONFIRM_STAGE_PATH]: INSTRUMENT_STAGE_PATH
};
const STAGE_COMPONENT = {
  [NAME_STAGE_PATH]: NameStage,
  [EMAIL_STAGE_PATH]: EmailStage,
  [ROLE_SPOT_STAGE_PATH]: RoleSpotStage,
  [INSTRUMENT_STAGE_PATH]: InstrumentStage,
  [CONFIRM_STAGE_PATH]: ConfirmStage
};

const stageRouteFromRoute = route => {
  const splitArr = route.split('/');
  return splitArr[splitArr.length - 1];
};
const shouldRenderBack = route =>
  stageRouteFromRoute(route) !== NAME_STAGE_PATH;
const shouldRenderNext = (state, route) =>
  state.navigateNext && stageRouteFromRoute(route) !== CONFIRM_STAGE_PATH;

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    buckId: '',
    role: Object.values(userHelpers.roles)[0],
    spot: {
      row: Object.values(spotHelpers.rows)[0],
      file: 1
    },
    instrument: userHelpers.instruments.ANY,
    part: userHelpers.parts.ANY
  },
  navigateNext: false
};

class CreateUser extends React.Component {
  static get propTypes() {
    return {
      history: PropTypes.shape({ goBack: PropTypes.func.isRequired }),
      location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
      match: PropTypes.shape({ path: PropTypes.string.isRequired })
    };
  }

  constructor(props) {
    super(props);
    this.state = { ...initialState };
    this.handleFormComplete = this.handleFormComplete.bind(this);
    this.handleFormIncomplete = this.handleFormIncomplete.bind(this);
    this.renderStage = this.renderStage.bind(this);
  }

  componentWillUpdate(nextProps) {
    const currentPathname = this.props.location.pathname;
    const nextPathname = nextProps.location.pathname;
    const currentStage = this.stage;

    if (currentPathname === nextPathname) return;
    if (!currentStage) return;

    this.setState(state => ({
      ...state,
      user: {
        ...state.user,
        ...currentStage.state
      }
    }));
  }

  handleFormComplete() {
    if (!this.state.navigateNext) {
      this.setState({ navigateNext: true });
    }
  }

  handleFormIncomplete() {
    if (this.state.navigateNext) {
      this.setState({ navigateNext: false });
    }
  }

  renderStage() {
    const path = stageRouteFromRoute(this.props.location.pathname);
    const StageComponent = STAGE_COMPONENT[path];

    return (
      <StageComponent
        user={{ ...this.state.user }}
        onFormComplete={this.handleFormComplete}
        onFormIncomplete={this.handleFormIncomplete}
        history={this.props.history}
        ref={ref => {
          this.stage = ref;
        }}
      />
    );
  }

  render() {
    const currentPath = this.props.location.pathname;
    const canNavigateBack = shouldRenderBack(currentPath);
    const canNavigateNext = shouldRenderNext(this.state, currentPath);
    const basePath = this.props.match.path;
    const stageRoute = stageRouteFromRoute(currentPath);
    const previousStageRoute = PREVIOUS_ROUTE[stageRoute];
    const nextStageRoute = NEXT_ROUTE[stageRoute];

    if (currentPath === basePath) {
      return <Redirect to={`${basePath}/${NAME_STAGE_PATH}`} />;
    }

    return (
      <Container>
        <Elevation
          style={{
            height: '400px',
            width: '80%',
            maxWidth: '650px'
          }}
        >
          <StageContainer>
            <Typography category="display" number={2}>
              Create New User
            </Typography>
            <Route
              path={`${basePath}/${NAME_STAGE_PATH}`}
              render={this.renderStage}
            />
            <Route
              path={`${basePath}/${EMAIL_STAGE_PATH}`}
              render={this.renderStage}
            />
            <Route
              path={`${basePath}/${ROLE_SPOT_STAGE_PATH}`}
              render={this.renderStage}
            />
            <Route
              path={`${basePath}/${INSTRUMENT_STAGE_PATH}`}
              render={this.renderStage}
            />
            <Route
              path={`${basePath}/${CONFIRM_STAGE_PATH}`}
              render={this.renderStage}
            />
            <ButtonContainer>
              <Button primary disabled={!canNavigateBack}>
                <Link
                  to={`${basePath}/${previousStageRoute}`}
                  style={{ ...linkStyle }}
                >
                  Back
                </Link>
              </Button>
              <Button
                primary
                disabled={!canNavigateNext}
                style={{ marginLeft: '4px' }}
              >
                <Link
                  to={`${basePath}/${nextStageRoute}`}
                  style={{ ...linkStyle }}
                >
                  Next
                </Link>
              </Button>
            </ButtonContainer>
          </StageContainer>
        </Elevation>
      </Container>
    );
  }
}

export default withRouter(CreateUser);
