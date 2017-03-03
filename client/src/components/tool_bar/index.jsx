import React from 'react';

import './index.scss';
export default function ToolBar({ iconElementLeft, iconElementRight, title }) {
  return (
    <div className="mdc-toolbar mdc-toolbar--fixed challenges-toolbar">
      {iconElementLeft &&
        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
          {iconElementLeft}
        </section>
      }
      <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
        <h1 className="mdc-toolbar__title">{title}</h1>
      </section>
      {iconElementRight &&
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
          {iconElementRight}
        </section>
      }
    </div>
  );
}

ToolBar.propTypes = {
  iconElementLeft: React.PropTypes.node,
  iconElementRight: React.PropTypes.node,
  title: React.PropTypes.string
};
