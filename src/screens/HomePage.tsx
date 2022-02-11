import * as React from "react";
import {useNavigate} from "react-router-dom";

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
      <h1 className="text-6xl title-gradient-1">
        Tip anyone, anywhere
      </h1>
      <h4 className="mt-3">
        DesmosTipBot allows you to send tips to every account on supported social networks
        without the need of any intermediary.
      </h4>
      <button className="mt-5" onClick={handleClickExample}>
        View example donation page
      </button>

      <h3 className="text-orange mt-10">Instant DSM Donation Alerts</h3>
      <p>Receive DSM donations and convert the amounts to any currency instantly.</p>
    </div>
  );
}

export default HomePage;