import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Logo from './Logo'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar">
        <Logo />
        {/* <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          CryptoBridge
        </a> */}
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