import * as React from "react";
import {useSelector} from "react-redux";
import {getLoggedInUser} from "store/user";
import OAuthPopup from "screens/dashboard/integrations/popups/OAuthPopup";
import {getDisplayName} from "../../components/utils";
import IntegrationsSection from "./integrations/IntegrationsSection";
import TipsSection from "./tips/TipsSection";

/**
 * Represents the dashboard of the app for logged in users.
 * @returns {JSX.Element}
 * @constructor
 */
function DashboardPage() {
  // Get the user state
  const user = useSelector(getLoggedInUser);

  return (
    <div>
      <h1 className="mt-3">Dashboard</h1>
      <p>
        Welcome, {getDisplayName(user.profile)}.
        From here you can manage your settings within DesmosTipBot.
      </p>

      <IntegrationsSection/>
      <TipsSection/>

      <OAuthPopup/>

    </div>
  );
}

export default DashboardPage;