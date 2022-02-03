import * as React from "react"
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDonationState, setAmount, setMessage} from "store/donation";
import {sendDonation} from "store/donation/actions";
import {useAuth} from "components/AuthProvider";
import {LoggedIn} from "types/user";
import {ChangeEvent} from "react";

type Params = {
  platform: string;
  username: string;
}

/**
 * Represents the screen that allows to donate some DSM to someone.
 * @returns {JSX.Element}
 * @constructor
 */
const DonationPage: React.FC = () => {
  // Get the user data
  const userState = useAuth().userState as LoggedIn;

  // Get the donation state
  const dispatch = useDispatch();
  const state = useSelector(getDonationState);

  // Get the params from the URL
  const {platform, username} = useParams<Params>();


  function handleChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setAmount(parseInt(e.target.value)));
  }

  function handleChangeMessage(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setMessage(e.target.value))
  }

  /**
   * Handles the donation submission.
   */
  function handleSubmit(_: React.FormEvent<HTMLFormElement>) {
    dispatch(sendDonation({
      tipperAddress: userState.desmosAddress,
      recipientPlatform: platform as string,
      recipientUsername: username as string,
      tipAmount: state.amount,
      donationMessage: state.message,
    }))
  }

  return (
    <div>
      <h2>You are donating to {username} on <span className="capitalize">{platform}</span></h2>

      <form onSubmit={handleSubmit}>
        <p className="mt-5">Amount of DSM to donate:</p>
        <input
          type="number"
          className="input-orange text-center"
          placeholder="100"
          onChange={handleChangeAmount}
          value={state.amount}
        />

        <p className="mt-5">Donation message</p>
        <input
          type="text"
          className="input-orange w-full"
          placeholder="Donation message"
          onChange={handleChangeMessage}
          value={state.message}
        />

        <button type="submit" className="btn-orange block mt-5">
          Donate
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