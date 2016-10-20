import React, { Component, PropTypes } from 'react';

class ResultForEvaluation extends Component {

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { id, spotId } = this.props;
    const { firstComments, firstNameNumber, secondNameNumber, secondComments } = this.refs;
    const winner = firstNameNumber.checked ? firstNameNumber.value : secondNameNumber.value;

    this.props.onSubmit(id, firstComments.value, secondComments && secondComments.value, spotId, winner);
  }

  render() {
    const { firstName, firstNameNumber, id, secondName, secondNameNumber, spotId } = this.props;

    return (
      <div className="ResultForEvaluation">
        <div className="ResultForEvaluation-header">
          <p className="ResultForEvaluation-header-left">
            <label>{firstName}</label>
            <input defaultChecked name={id} ref="firstNameNumber" type="radio" value={firstNameNumber} />
          </p>
          <p className="ResultForEvaluation-header-middle">{spotId}</p>
          <p className="ResultForEvaluation-header-right">
            <label>{secondName || ''}</label>
            {secondName && secondNameNumber &&
              <input name={id} ref="secondNameNumber" type="radio" value={secondNameNumber} />
            }
          </p>
        </div>
        <div className="ResultForEvaluation-comments">
          <textarea
            className="ResultForEvaluation-comments-left"
            placeholder={`Comments for ${firstName}`}
            ref="firstComments"
          />
          {secondName && secondNameNumber &&
            <textarea
              className="ResultForEvaluation-comments-right"
              placeholder={`Comments for ${secondName}`}
              ref="secondComments"
            />
          }
        </div>
        <div className="ResultForEvaluation-submit">
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

ResultForEvaluation.propTypes = {
  firstName: PropTypes.string.isRequired,
  firstNameNumber: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  secondName: PropTypes.string,
  secondNameNumber: PropTypes.string,
  spotId: PropTypes.string.isRequired
};

export default ResultForEvaluation;
