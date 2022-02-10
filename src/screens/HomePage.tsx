import * as React from "react";
import {useNavigate} from "react-router-dom";

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
    </div>
  );
}

export default HomePage;