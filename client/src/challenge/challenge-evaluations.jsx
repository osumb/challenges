import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

import './challenge-evaluations.scss';
import { api } from '../utils';
import ApiWrapper from '../shared-components/api-wrapper';
import UserComments from './user-comments';
import UserComparison from './user-comparison';

const endPoint = '/results/evaluate';
const postEndPoint = '/results/evaluate';

class ChallengeEvaluations extends Component {

  static propTypes() {
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
    const userMap = props.results.reduce((acc, { firstNameNumber, secondNameNumber }) => {
      acc[firstNameNumber] = '';
      if (secondNameNumber) {
        acc[secondNameNumber] = '';
      }
      return acc;
    }, {});

    this.state = {
      evaluating: true,
      results: props.results,
      userMap
    };
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleEvaluationToggle = this.handleEvaluationToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCommentsChange(nameNumber, comments) {
    const { userMap } = this.state;

    this.setState({
      userMap: {
        ...userMap,
        [nameNumber]: comments
      }
    });
  }

  handleEvaluationToggle() {
    const { evaluating } = this.state;

    this.setState({
      evaluating: !evaluating
    });
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
    const { evaluating, results, userMap } = this.state;
    const userComments = results.reduce((acc, { firstName, firstNameNumber, secondName, secondNameNumber }) => {
      acc.push({ comments: userMap[firstNameNumber], name: firstName, nameNumber: firstNameNumber });
      if (secondName && secondNameNumber) {
        acc.push({ comments: userMap[secondNameNumber], name: secondName, nameNumber: secondNameNumber });
      }
      return acc;
    }, []);

    if ((results || []).length < 1) {
      return (
        <div className="ChallengeEvaluations">
          <h2>There are no challenges for you to evaluate</h2>
        </div>
      );
    }

    if (evaluating) {
      return (
        <div className="ChallengeEvaluations">
          <div className="ChallengeEvaluations-header">
            <h2>Type your comments for each person involved</h2>
            <FlatButton id="ChallengeEvaluations-headerButton" onClick={this.handleEvaluationToggle}>Turn in Evaluations</FlatButton>
          </div>
          <div className="ChallengeEvaluations-userComments">
            {userComments.map(({ comments, name, nameNumber }) =>
              <UserComments
                key={nameNumber}
                comments={comments}
                name={name}
                nameNumber={nameNumber}
                onChange={this.handleCommentsChange}
              />
            )}
          </div>
        </div>
      );
    }

    const userComparisons = results.map((result) => ({
      ...result,
      firstComments: userMap[result.firstNameNumber],
      onSubmit: this.handleSubmit,
      secondComments: userMap[result.secondNameNumber]
    }));

    return (
      <div className="ChallengeEvaluations">
        <div className="ChallengeEvaluations-header">
          <h2>Turn in your evaluations</h2>
          <FlatButton id="ChallengeEvaluations-headerButton" onClick={this.handleEvaluationToggle}>Back</FlatButton>
        </div>
        <div className="ChallengeEvaluations-userComparisons">
          {userComparisons.map(({ id, ...rest }) =>
            <UserComparison key={id} id={id} {...rest} />
          )}
        </div>
      </div>
    );
  }
}

const Wrapper = () => <ApiWrapper container={ChallengeEvaluations} endPoint={endPoint} />;

export default Wrapper;
