import React from 'react';

export default class Graph extends React.Component {
  render() {
    return (
      <div className="py2 flex-auto">
        <div className="h6 regular dark-gray">master</div>
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
    for (var i = 0; i < 20; i++) bars.push(i);
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
