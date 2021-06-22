import React, { useState, useEffect } from "react";
import Moment from "react-moment";

import "./App.css";

// Header component to show the heading and the current balance
const Header = ({ amount }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ display: "inline-block" }}>My Cashbook</h1>
      <div className="today-balance">
        <h1>{`${amount} INR`}</h1>
        <p>Today's Balance</p>
      </div>
    </div>
  );
};

// Layout for the transaction table
const Transactions = ({ data }) => {
  const transaction =
    data.length > 0
      ? data.map((entry, index) => {
          return (
            <div className="transaction" key={index}>
              <div className="entry">
                <Moment>{entry.timestamp}</Moment>
                <h1>{entry.note}</h1>
              </div>
              <div className="entry out">
                <h1>Out</h1>
                <div className="amount">
                  {entry.actionType === 2 ? entry.amount : "-"}
                </div>
              </div>
              <div className="entry in">
                <h1>In</h1>
                <div className="amount">
                  {entry.actionType === 1 ? entry.amount : "-"}
                </div>
              </div>
            </div>
          );
        })
      : "";

  return transaction;
};

//  Entry modal setup

const EntryModal = ({ actionType, closeModal, sendFormData }) => {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (amount && typeof amount === "number" && note) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [amount, note]);

  const onAmountChangeHandler = event => {
    setAmount(+event.target.value);
  };
  const onNoteChangeHandler = event => {
    setNote(event.target.value);
  };

  return (
    <div className="model">
      <div className="model-content">
        <button className="close-btn" onClick={closeModal}>
          Close
        </button>
        <h3> New Entry</h3>
        <input
          placeholder="INR 0.0"
          onChange={onAmountChangeHandler}
          value={amount}
        ></input>
        <textarea onChange={onNoteChangeHandler} value={note}></textarea>
        <button
          className={actionType === 1 ? "green-btn" : "red-btn"}
          disabled={disabled}
          onClick={() => {
            sendFormData({ amount, note, actionType });
            closeModal();
          }}
        >
          {actionType === 1 ? "IN" : "OUT"}
        </button>
      </div>
    </div>
  );
};

// Action control component to take appropriate action
const ActionControl = ({ setFormData }) => {
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState();

  const openInModal = () => {
    setOpenModal(true);
    setType(1);
  };
  const openOutModal = () => {
    setOpenModal(true);
    setType(2);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      {openModal ? (
        <EntryModal
          actionType={type}
          closeModal={closeModal}
          sendFormData={setFormData}
        />
      ) : (
        ""
      )}
      <div className="action-group">
        <button
          className="red"
          data-testid="cashout-btn"
          onClick={openOutModal}
        >
          Out
        </button>
        <button
          className="green"
          data-testid="cashout-btn"
          onClick={openInModal}
        >
          In
        </button>
      </div>
    </>
  );
};

const App = () => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [transactionData, setTransactionData] = useState([]);

  const formDataHandler = ({ amount, note, actionType }) => {
    const finalAmount = {
      1: currentAmount + amount,
      2: currentAmount - amount
    };
    setCurrentAmount(finalAmount[actionType]);
    const obj = { amount, note, actionType, timestamp: new Date() };
    setTransactionData(transactionData => [...transactionData, obj]);
    console.log(transactionData);
  };

  return (
    <div className="App">
      <Header amount={currentAmount} />
      <Transactions data={transactionData} />
      <ActionControl setFormData={formDataHandler} />
    </div>
  );
};

export default App;
