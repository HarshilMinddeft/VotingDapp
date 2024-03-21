import React from "react";

const Login = (props) => {
  return (
    <div className="login-container">
      <h1 className="welcome-message">welcome to Voting Dapp</h1>
      <button className="addButton1" onClick={props.connectWallet}>
        Login Metamask
      </button>
    </div>
  );
};

export default Login;
