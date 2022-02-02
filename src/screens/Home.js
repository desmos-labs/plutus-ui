import React, {useState} from "react";
import {authorizeStreamlabs} from "../apis/oauth";
import {Store, Keys} from "../store";

/**
 * Represents the home screen of the app.
 * @returns {JSX.Element}
 * @constructor
 */
function Home() {
  const [desmosAddress, setDesmosAddress] = useState('');

  function connectStreamlabs() {
    Store.setValue(Keys.DesmosAddress, desmosAddress);
    authorizeStreamlabs();
  }

  function handleChange(event) {
    setDesmosAddress(event.target.value);
  }

  return (
    <div>
      <p>Connect your Streamlabs account now</p>
      <p>Insert below your Desmos address</p>
      <input type="text" className="input-orange mr-1" value={desmosAddress} onChange={handleChange}/>
      <button className="btn-orange" onClick={connectStreamlabs}>Connect Streamlabs</button>
    </div>
  );
}

export default Home;