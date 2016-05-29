import React from 'react';

class Graph extends React.Component {
  static propTypes = {
    branch: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="py2" style={{width: (7 * 30) + 20}}>
        <div className="h6 regular dark-gray">{this.props.branch}</div>
        <div className="overflow-hidden align-bottom relative" style={{height:50}}>
          {this._bars().map((i) =>
            <div
              key={i}
              className="border-box inline-block absolute bottom"
              style={{
                backgroundColor: this._randomColor(),
                width: 7,
                bottom: 0,
                left: i * (7 + 1),
                height: `${this._randomHeight()}%`
              }}>{' '}</div>
          )}
        </div>
      </div>
    )
  }

  _bars() {
    let bars = [];
    for (var i = 0; i < 30; i++) bars.push(i);
    return bars;
  }

  _randomColor() {
    const colors = ["#B0DF21", "#B0DF21", "#B0DF21", "#B0DF21", "#FFBA03", "#F73F23"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  _randomHeight() {
    return 50 + Math.random() * 50;
  }
}

export default Graph
