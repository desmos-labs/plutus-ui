import * as React from "react";
import {Link, useNavigate} from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1>Trustless donations on Twitch, Twitter and Reddit</h1>
      <Link to="/donate/twitch/lucag__" replace={false} className="btn-orange">
        View example donation page
      </Link>
    </div>
  );
}

export default HomePage;