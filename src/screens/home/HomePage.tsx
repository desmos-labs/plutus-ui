import * as React from "react";
import {useNavigate} from "react-router-dom";
import PrimaryButton from "../../components/buttons/PrimaryButton";

/**
 * Represents the home page of the application.
 */
function HomePage() {
  const navigate = useNavigate();

  function handleClickExample() {
    navigate("/donate/twitch/lucag__", {replace: false})
  }

  return (
    <div className="py-16">
      <h1 className="font-bold">Trustless Donations</h1>
      <h2>on Twitch, Twitter and Reddit</h2>
      <p className="mt-3">
        DesmosTipBot allows you to send tips to every account on supported social networks
        without the need of any intermediary.
      </p>
      <PrimaryButton className="mt-2" onClick={handleClickExample}>View example donation page</PrimaryButton>

      <h3 className="text-orange mt-10">Instant DSM Donation Alerts</h3>
      <p>Receive DSM donations and convert the amounts to any currency instantly.</p>
    </div>
  );
}

export default HomePage;