import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

import './challenge-evaluations.scss';
import { api } from '../utils';
import { apiWrapper } from '../utils';
import UserComments from './user-comments';
import UserComparison from './user-comparison';

const endPoint = '/results/evaluate';
const postEndPoint = '/results/evaluate';

class ChallengeEvaluations extends Component {

  static get propTypes() {
    return {
      results: PropTypes.arrayOf(PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        firstNameNumber: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        performanceDate: PropTypes.string.isRequired,
        secondName: PropTypes.string,
        secondNameNumber: PropTypes.string,
        spotId: PropTypes.string.isRequired
      })).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      evaluating: true,
      results: props.results
    };
    this.handleEvaluationToggle = this.handleEvaluationToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEvaluationToggle() {
    const { evaluating, results } = this.state;

    if (evaluating) {
      this.setState({
        evaluating: !evaluating,
        results: results.map(({ id, ...rest }) => ({
          ...rest,
          id,
          firstComments: this.refs[id].value().firstComments,
          secondComments: this.refs[id].value().secondComments
        }))
      });
    } else {
      this.setState({
        evaluating: !evaluating
      });
    }
  }

  handleSubmit({ id, ...rest }) {
    const { results } = this.state;

    api.put(postEndPoint, { id, ...rest })
    .then(() => {
      this.setState({
        results: results.filter(({ id: rId }) => rId !== id)
      });
    });
  }

  render() {
    const { evaluating, results } = this.state;
    const userComparisons = results.map((result) => ({
      ...result,
      onSubmit: this.handleSubmit
    }));

    if ((results || []).length < 1) {
      return (
        <div className="ChallengeEvaluations">
          <h2>There are no challenges for you to evaluate</h2>
        </div>
      );
    }

    return (
      <div className="ChallengeEvaluations">
        <div className="ChallengeEvaluations-header">
          <h2>{evaluating ? 'Type your comments for each person involved' : 'Turn in your evaluations'}</h2>
          <FlatButton id="ChallengeEvaluations-headerButton" onTouchTap={this.handleEvaluationToggle}>
            {evaluating ? 'Turn in Evaluations' : 'Back'}
          </FlatButton>
        </div>
        <div className="ChallengeEvaluations-items">
          {evaluating ?
            results.map(({ id, ...rest }) =>
              <UserComments
                ref={id}
                key={id}
                {...rest}
              />
            ) :
            userComparisons.map(({ id, ...rest }) =>
              <UserComparison key={id} id={id} {...rest} />
            )
          }
        </div>
      </div>
    );
  }
}

const Wrapper = apiWrapper(ChallengeEvaluations, endPoint);

export default Wrapper;
