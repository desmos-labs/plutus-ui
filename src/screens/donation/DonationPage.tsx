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

import ProfileCover from "screens/donation/components/ProfileCover";
import ConfirmTxPopup from "components/transactions/popup/ConfirmTxPopup";
import {getUserState, LoginStep} from "store/user";
import {formatDenom} from "../../types";
import DesmosSelect, {DesmosOption} from "../../components/inputs/DesmosSelect";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import DesmosInput from "../../components/inputs/DesmosInput";

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

  function handleChangeRecipientAddress({value}: DesmosOption) {
    dispatch(changeRecipientAddress(value));
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
  function handleSubmit() {
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
    <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">

      <ProfileCover
        className="h-[200px] md:h-[200px]"
        profile={state.recipientProfile}
        application={application}
        username={username}
      />

      <form className="flex flex-col md:w-3/4 mx-auto">

        <label className="mt-5">Recipient address</label>
        <DesmosSelect
          value={{label: state.recipientProfile.address, value: state.recipientProfile.address}}
          enabled={state.recipientAddresses.length > 1}
          onChange={handleChangeRecipientAddress}
          options={state.recipientAddresses.map((address) => {
            return {
              label: address,
              value: address,
            }
          })}
        />

        <label className="mt-5">Amount ({formatDenom(state.denom)})</label>
        <DesmosInput type="number" placeholder="0.5" onChange={handleChangeAmount} value={state.amount}/>

        <label className="mt-5">From</label>
        <DesmosInput type="text" placeholder="John Doe" onChange={handleChangeUsername} value={state.username}/>

        <label className="mt-5">Donation message</label>
        <DesmosInput type="text" placeholder="Hello!" onChange={handleChangeMessage} value={state.message}/>

        <PrimaryButton className="mt-7" onClick={handleSubmit}>Submit</PrimaryButton>
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