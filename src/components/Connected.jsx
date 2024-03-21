import React from "react";
import "./connected.css";
const Connected = (props) => {
  return (
    <div className="connected-container">
      <h1 className="welcome-message">Connected to metamask</h1>
      <p className="connected-accounts">Metamask Account :{props.account}</p>
      <p className="connected-accounts">
        <p className="red">{props.statuss}</p>
        Remaining Time :{props.remainingtime}
      </p>
      {props.showButton ? (
        <p className="connected-accounts">You have already Voted</p>
      ) : (
        <>
          <div>
            <input
              className="numbers"
              inputmode="numeric"
              defaultValue={0}
              min={0}
              max={6}
              minLength={1}
              maxLength={1}
              type="number"
              placeholder="Enter candidate Index"
              value={props.number}
              onChange={props.handleNumberChange}
            ></input>
          </div>
          <button className="addButton" onClick={props.voteFunction}>
            Vote
          </button>
        </>
      )}

      <div className="userTable">
        <table id="myTable" border={1} cellPadding={10} cellSpacing={0}>
          <thead>
            <tr>
              <th>Index</th>
              <th>Candidate Name</th>
              <th>Candidate Votes</th>
            </tr>
          </thead>
          <tbody>
            {props.candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.index}</td>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Connected;
