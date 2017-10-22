import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../../components/button';
import Elevation from '../../../components/elevation';
import EmailStage from './components/email_stage';
import NameStage from './components/name_stage';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
const StageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const linkStyle = {
  color: 'white'
};

const NAME_STAGE_PATH = 'names';
const EMAIL_STAGE_PATH = 'email';

const NEXT_ROUTE = {
  [NAME_STAGE_PATH]: EMAIL_STAGE_PATH
};
const PREVIOUS_ROUTE = {
  [EMAIL_STAGE_PATH]: NAME_STAGE_PATH
};

const stageRouteFromRoute = route => {
  const splitArr = route.split('/');
  return splitArr[splitArr.length - 1];
};
const shouldRenderBack = route => stageRouteFromRoute(route) !== NAME_STAGE_PATH;

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    buckId: '',
    spot: {
      row: null,
      file: null
    }
  },
  renderBack: false,
  renderNext: false
};

class CreateUser extends React.Component {
  static get propTypes() {
    return {
      location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
      match: PropTypes.shape({ path: PropTypes.string.isRequired })
    };
  }

  constructor(props) {
    super(props);
    this.state = { ...initialState };
    this.renderEmailStage = this.renderEmailStage.bind(this);
    this.renderNameStage = this.renderNameStage.bind(this);
  }

  renderEmailStage() {
    return (
      <EmailStage />
    );
  }

  renderNameStage() {
    return (
      <NameStage />
    );
  }

  render() {
    const currentPath = this.props.location.pathname;
    const canNavigateBack = shouldRenderBack(currentPath);
    const basePath = this.props.match.path;
    const stageRoute = stageRouteFromRoute(currentPath);
    const previousStageRoute = PREVIOUS_ROUTE[stageRoute];
    const nextStageRoute = NEXT_ROUTE[stageRoute];

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
            <Route
              path={`${basePath}/${NAME_STAGE_PATH}`}
              render={this.renderNameStage}
            />
            <Route
              path={`${basePath}/${EMAIL_STAGE_PATH}`}
              render={this.renderEmailStage}
            />
            <ButtonContainer>
              <Button primary disabled={!canNavigateBack}>
                <Link to={`${basePath}/${previousStageRoute}`} style={{ ...linkStyle }}>Back</Link>
              </Button>
              <Button primary style={{ marginLeft: '4px' }}>
                <Link to={`${basePath}/${nextStageRoute}`} style={{ ...linkStyle }}>Next</Link>
              </Button>
            </ButtonContainer>
          </StageContainer>
        </Elevation>
      </Container>
    );
  }
}

export default withRouter(CreateUser);

