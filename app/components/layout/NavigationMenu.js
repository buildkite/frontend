import React from 'react';

require("../../css/NavigationMenu.css")

class NavigationMenu extends React.Component {
  render() {
    return (
      <div className="NavigationMenu">
        <ul>
          {
            React.Children.map(this.props.children, (child) => {
              return <li className={this._classNameForChild(child)}>{child}</li>
            })
          }
        </ul>
      </div>
    )
  }

  _classNameForChild(child) {
    if(window.location.pathname == child.props['href']) {
      return "NavigationMenu__Item--Active";
    } else {
      return "NavigationMenu__Item";
    }
  }
};

export default NavigationMenu;
