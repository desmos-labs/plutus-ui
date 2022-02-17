import * as React from "react"
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  DonationStatus,
  getDonationState,
  setAmount,
  setMessage,
  setUsername
} from "store/donation";
import {changeRecipientAddress, initDonationState, sendDonation} from "store/donation/actions";
import {ChangeEvent, useEffect} from "react";

import ProfileCover from "components/profile/ProfileCover";
import ConfirmTxPopup from "components/transactions/ConfirmTxPopup";
import {getUserState, LoginStep} from "store/user";
import {coinToString, formatDenom} from "../types";

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
  const userState = useSelector(getUserState);

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
    dispatch(initDonationState(application, username))
  }, [false])

  function handleChangeRecipientAddress(e: ChangeEvent<HTMLSelectElement>) {
    dispatch(changeRecipientAddress(e.target.value));
  }

  function handleChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setAmount(e.target.value));
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

    if (userState.step !== LoginStep.LOGGED_IN) {
      navigate("/login")
      return
    }

    dispatch(sendDonation({
      recipientAddress: state.recipientProfile.address,
      recipientApplication: application as string,
      recipientUsername: username as string,
      tipAmount: parseFloat(state.amount || '0.5'),
      tipperUsername: state.username,
      message: state.message,
    }))
  }


  return (
    <div className="w-3/4 lg:w-1/3 mx-auto text-center">

      <ProfileCover
        className="h-[300px]"
        profile={state.recipientProfile}
        application={application}
        username={username}
      />

      <form className="flex flex-col w-3/4 mx-auto" onSubmit={handleSubmit}>

        <label className="mt-5">Recipient address</label>
        <select
          className="text-sm bg-transparent rounded border-2 border-orange"
          value={state.recipientProfile.address}
          onChange={handleChangeRecipientAddress}>
          {state.recipientAddresses.map((address) => (
            <option key={address} value={address}>{address}</option>
          ))}
        </select>

        <label className="mt-5">Amount ({formatDenom(state.denom)})</label>
        <input type="number" placeholder="0.5" onChange={handleChangeAmount} value={state.amount}/>

        <label className="mt-5">From</label>
        <input type="text" placeholder="John Doe" onChange={handleChangeUsername} value={state.username}/>

        <label className="mt-5">Donation message</label>
        <input type="text" placeholder="Hello!" onChange={handleChangeMessage} value={state.message}/>

        <button className="mt-10" type="submit">Confirm transaction</button>
      </form>

      {state.status == DonationStatus.LOADING &&
        <p>Loading...</p>
      }

      <ConfirmTxPopup/>

      {state.status == DonationStatus.ERROR &&
        <p>Error: {state.error}</p>
      }
    </div>
  );
}

export default DonationPage;