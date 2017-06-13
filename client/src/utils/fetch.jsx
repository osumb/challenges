import React from 'react';

class Fetcher extends React.PureComponent {
  static get propTypes() {
    return {
      fetch: React.PropTypes.func.isRequired,
      propsFromData: React.PropTypes.func,
      Component: React.PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    this.props.fetch(this.props).then(data => {
      this.setState({ data });
    });
  }

  render() {
    const { data } = this.state;
    const { propsFromData, Component } = this.props;
    let newData = data;

    if (data === null) {
      return <div>Loading...</div>;
    }

    if (propsFromData) newData = propsFromData(newData);

    return <Component {...newData} />;
  }
}

export default function FetchWrapper(fetch, propsFromData, component) {
  return function Fetch(props) {
    return (
      <Fetcher
        fetch={fetch}
        propsFromData={propsFromData}
        Component={component}
        {...props}
      />
    );
  };
}
