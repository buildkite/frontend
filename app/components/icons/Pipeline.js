// @flow
import React from 'react';

export default class Pipeline extends React.PureComponent<{}> {
  render() {
    return (
      <svg width="80px" height="80px" viewBox="0 0 90 90">
        <title>Pipeline</title>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g stroke="#00D974" strokeWidth="2">
            <g transform="translate(45, 45)">
              <circle cx="0" cy="0" r="40" />
            </g>
            <g transform="translate(20,50)">
              <g transform="translate(0, 0)">
                <g className="animation-slide-in-from-right" style={{ animationDelay: ".95s", animationDuration: ".7s" }}>
                  <circle fill="#FFFFFF" cx="0" cy="0" r="4" className="animation-pop-in" style={{ animationDelay: ".5s", animationDuration: "0.5s" }} />
                </g>
              </g>
              <g transform="translate(-5, -21)">
                <g className="animation-slide-in-from-right" style={{ animationDelay: ".95s", animationDuration: ".7s" }}>
                  <path className="animation-stroke-dashoffset-300" style={{ animationDelay: ".95s", animationDuration: "1.1s" }} d="M4.98569929,17.6762145 C4.98569929,17.6762145 4.98569929,3.67621449 4.98569929,3.67621449 C4.98569929,-0.323785511 12.9856993,-0.323785511 12.9856993,3.67621449 C12.9856993,3.67621449 12.9856993,27.6762145 12.9856993,27.6762145 C12.9856993,31.6762145 20.9856993,31.6762145 20.9856993,27.6762145 L20.9856993,3.67621449 C20.9856993,-0.323785511 28.9856993,-0.323785511 28.9856993,3.67621449 C28.9856993,10.8139101 28.9856993,21.4740661 28.9856993,27.6762145 C28.9856993,31.6762145 36.9856993,31.6762145 36.9856993,27.6762145 C36.9856993,19.7582457 36.9856993,3.67621449 36.9856993,3.67621449 C36.9856993,-0.323785511 44.9856993,-0.323785511 44.9856993,3.67621449 C44.9856993,7.52484753 44.9856993,19.6762145 44.9856993,27.6762145 C44.9856993,31.6762145 52.9856993,31.6762145 52.9856993,27.6762145 C52.9856993,21.715277 52.9856993,11.6762145 52.9856993,11.6762145" />
                </g>
              </g>
              <g transform="translate(48, -12)">
                <g className="animation-slide-in-from-right" style={{ animationDelay: ".95s", animationDuration: ".7s" }}>
                  <circle fill="#FFFFFF" cx="0" cy="0" r="4" className="animation-pop-in" style={{ animationDelay: "1.15s", animationDuration: "0.5s" }} />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }
}
