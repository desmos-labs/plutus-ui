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
import {changeRecipientAddress, getRecipientAddresses, sendDonation} from "store/donation/actions";
import {useAuth} from "components/AuthProvider";
import {ChangeEvent, useEffect} from "react";
import {DonationStatus} from "types/donation";
import {getDisplayName} from "types/desmos";

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

    if (!userState.isLoggedIn) {
      navigate("/login")
      return
    }

    dispatch(sendDonation({
      recipientAddress: state.recipientAddress,
      tipperAddress: userState.desmosAddress,
      recipientApplication: application as string,
      recipientUsername: username as string,
      tipAmount: parseFloat(state.amount || '0.5'),
      tipperUsername: state.username,
      message: state.message,
    }))
  }

  const name = state.recipientProfile ? getDisplayName(state.recipientProfile) : state.recipientAddresses;
  const profilePic = state.recipientProfile?.profilePicture || 'https://desmos.network/images/background-desktop.png';
  const coverPicture = state.recipientProfile?.coverPicture || 'https://desmos.network/images/background-desktop.png';
  const coverStyle = {
    backgroundImage: `url(${coverPicture})`,
  }
  return (
    <div className="w-[600px] mx-auto text-center pt-2">

      <div className="relative bg-cover bg-center rounded-3xl h-[300px]" style={coverStyle}>
        <div className="absolute bottom-5 left-5 flex">
          <img className="h-20 w-20 rounded-xl" src={profilePic} alt="Profile picture"/>
          <div className="text-left ml-4">
            <h2 className="text-white text-3xl font-bold">{name}</h2>
            <h3 className="text-gray-300 text-xl font-bold">twitch.tv/{username}</h3>
          </div>
        </div>
      </div>

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
          placeholder="0.5"
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
          Confirm transaction
        </button>
      </form>

      {state.status == DonationStatus.LOADING &&
          <p>Loading...</p>
      }
      {state.status == DonationStatus.TX_REQUEST_SENT &&
          <p>Please confirm the transaction using DPM</p>
      }
      {state.status == DonationStatus.ERROR &&
          <p>Error: {state.error}</p>
      }
      {state.status == DonationStatus.SUCCESS &&
          <p>
              Transaction sent successfully!
              You can view it <a href={`https://morpheus.desmos.network/transactions/${state.txHash}`}>here</a>
          </p>
      }
    </div>
  );
}

export default DonationPage;