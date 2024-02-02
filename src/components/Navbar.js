import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Logo from './Logo'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar">
        <Logo />
        <div>
          <div className="inline">
            <p className="right0_5rem">{this.props.account.toUpperCase()}</p>
            {this.props.account ? (
              <img
                className="identicon"
                // width="30"
                // height="30"
                src={`data:image/png;base64,${new Identicon(
                  this.props.account,
                  30
                ).toString()}`}
              />
            ) : (
              <span></span>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;