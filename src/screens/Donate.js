import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {donate} from "../api/donations";
import {Keys, Store} from "../store";

function Donate() {
  const {platform, username} = useParams();
  const [donationAmount, setDonationAmount] = useState(0);
  const [donationMessage, setDonationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function onDonationAmountChange(event) {
    setDonationAmount(event.target.value);
  }

  function onDonationMessageChange(event) {
    setDonationMessage(event.target.value);
  }

  async function onClickDonate() {
    setError('');
    setLoading(true);
    const tipper = Store.getValue(Keys.DesmosAddress)
    const res = await donate(tipper, donationAmount, donationMessage, platform, username);
    setError(await res.text());
    setLoading(false)
  }

  return (
    <div>
      <h2>You are donating to {username} on <span className="capitalize">{platform}</span></h2>
      <p className="mt-5">Amount of DSM to donate:</p>
      <input type="number" className="input-orange text-center" placeholder="100" onChange={onDonationAmountChange}
             value={donationAmount}/>
      <p className="mt-5">Donation message</p>
      <input type="text" className="input-orange w-full" placeholder="Donation message"
             onChange={onDonationMessageChange} value={donationMessage}/>


      <button className="btn-orange block mt-5" onClick={onClickDonate}>Donate</button>

      {loading &&
        <p>Loading...</p>
      }
      {error &&
        <p>{error}</p>
      }
    </div>
  );
}

export default Donate;