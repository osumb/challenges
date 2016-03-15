var React = require('react');
var DefaultLayout = require('./layouts/default');

var ErrorMessage = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <h1>{this.props.message}</h1>
        <h1>{this.props.error.status}</h1>
      </DefaultLayout>
    );
  }
});

module.exports = ErrorMessage;
