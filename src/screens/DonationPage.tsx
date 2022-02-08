import * as React from "react"
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  getDonationState,
  setAmount,
  setMessage,
  setRecipientAddress,
  setUsername
} from "store/donation";
import {getRecipientAddresses, sendDonation} from "store/donation/actions";
import {useAuth} from "components/AuthProvider";
import {ChangeEvent, useEffect} from "react";

type Params = {
  application: string;
  username: string;
}

/**
 * Represents the screen that allows to donate some DSM to someone.
 * @returns {JSX.Element}
 * @constructor
 */
function DonationPage() {
  const navigate = useNavigate();

  // Get the user data
  const userState = useAuth().userState;

  // Get the donation state
  const dispatch = useDispatch();
  const state = useSelector(getDonationState);

  // Get the params from the URL
  const {application, username} = useParams<Params>();

  if (application == null || username == null) {
    navigate("/")
    return null;
  }

  useEffect(() => {
    dispatch(getRecipientAddresses(application, username))
  }, [false])

  function handleChangeRecipientAddress(e: ChangeEvent<HTMLSelectElement>) {
    dispatch(setRecipientAddress(e.target.value));
  }

  function handleChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setAmount(parseInt(e.target.value)));
  }

  function handleChangeUsername(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setUsername(e.target.value));
  }

  function handleChangeMessage(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setMessage(e.target.value));
  }

  /**
   * Handles the donation submission.
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userState.isLoggedIn) {
      navigate("/login")
      return
    }

    dispatch(sendDonation({
      recipientAddress: state.recipientAddress,
      tipperAddress: userState.desmosAddress,
      recipientApplication: application as string,
      recipientUsername: username as string,
      tipAmount: state.amount,
      tipperUsername: state.username,
      message: state.message,
    }))
  }

  return (
    <div className="w-3/5 mx-auto text-center">
      <h2>You are donating to {username} on <span className="capitalize">{application}</span></h2>

      <form onSubmit={handleSubmit}>
        <p className="mt-5">Select the recipient address</p>
        <select value={state.recipientAddress} onChange={handleChangeRecipientAddress}>
          {state.recipientAddresses.map((address) => (
            <option key={address} value={address}>{address}</option>
          ))}
        </select>

        <p className="mt-5">Amount (DSM)</p>
        <input
          type="number"
          className="input-orange"
          placeholder="1"
          onChange={handleChangeAmount}
          value={state.amount}
        />

        <p className="mt-5">From</p>
        <input
          type="text"
          className="input-orange"
          placeholder="John Doe"
          onChange={handleChangeUsername}
          value={state.username}
        />

        <p className="mt-5">Donation message</p>
        <input
          type="text"
          className="input-orange"
          placeholder="Hello!"
          onChange={handleChangeMessage}
          value={state.message}
        />

        <button type="submit" className="btn-orange block mt-5">
          Confirm with WalletConnect
        </button>
      </form>

      {state.isLoading &&
          <p>Loading...</p>
      }
      {state.error &&
          <p>Error: {state.error}</p>
      }
    </div>
  );
}

export default DonationPage;