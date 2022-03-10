import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useCallback, useEffect } from "react";
import {
  getDonationState,
  setAmount,
  setMessage,
  setUsername,
  changeSelectedProfile,
  initDonationState,
  sendDonation,
} from "../../store/donation";
import ProfileCover from "./components/ProfileCover";
import ConfirmTxPopup from "../../components/transactions/popup/ConfirmTxPopup";
import { getUserState, LoginStep } from "../../store/user";
import { DesmosProfile, formatDenom } from "../../types";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import DesmosInput from "../../components/inputs/DesmosInput";
import DesmosSelect from "../../components/inputs/DesmosSelect";

type Params = {
  application: string;
  username: string;
};

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
  const { application, username } = useParams<Params>();

  if (application == null || username == null) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    dispatch(initDonationState(application, username));
  }, [false]);

  const handleChangeRecipientAddress = useCallback((profile: DesmosProfile) => {
    dispatch(changeSelectedProfile(profile));
  }, []);

  const handleChangeAmount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAmount(e.target.value));
  }, []);

  const handleChangeUsername = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setUsername(e.target.value));
    },
    []
  );

  const handleChangeMessage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setMessage(e.target.value));
    },
    []
  );

  /**
   * Handles the donation submission.
   */
  const handleSubmit = useCallback(() => {
    if (userState.step !== LoginStep.LOGGED_IN) {
      navigate("/login");
      return;
    }

    dispatch(
      sendDonation({
        recipientAddress: state.selectedProfile.address,
        recipientApplication: application as string,
        recipientUsername: username as string,
        tipAmount: parseFloat(state.amount || "0.5"),
        tipperUsername: state.username,
        message: state.message,
      })
    );
  }, [state]);

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 xl:w-2/5 mx-auto">
      <ProfileCover
        className="h-[200px] md:h-[200px]"
        profile={state.selectedProfile}
        application={application}
        username={username}
      />

      <div className="flex flex-col md:w-3/4 mx-auto">
        <p className="mt-5 font-medium">Recipient address</p>
        <DesmosSelect
          value={state.selectedProfile}
          enabled={state.recipientProfiles.length > 1}
          onChange={handleChangeRecipientAddress}
          options={state.recipientProfiles}
        />

        <p className="mt-5 font-medium">Amount ({formatDenom(state.denom)})</p>
        <DesmosInput
          className="mt-2"
          type="number"
          placeholder="0.5"
          onChange={handleChangeAmount}
          value={state.amount}
        />

        <p className="mt-5 font-medium">From</p>
        <DesmosInput
          className="mt-2"
          type="text"
          placeholder="John Doe"
          onChange={handleChangeUsername}
          value={state.username}
        />

        <p className="mt-5 font-medium">Donation message</p>
        <DesmosInput
          className="mt-2"
          type="text"
          placeholder="Hello!"
          onChange={handleChangeMessage}
          value={state.message}
        />

        <PrimaryButton className="mt-7" onClick={handleSubmit}>
          Donate
        </PrimaryButton>
      </div>
      <ConfirmTxPopup />
    </div>
  );
}

export default DonationPage;
