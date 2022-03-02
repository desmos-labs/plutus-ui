import * as React from "react";
import {getPlatforms, Platform} from "../../../types";
import {useSelector} from "react-redux";
import {getLoggedInUser} from "../../../store/user";
import IntegrationRow from "./IntegrationRow";
import DisconnectIntegrationsPopup from "./popups/DisconnectIntegrationsPopup";

/**
 * Contains the details about the various integrations connected to the user profile.
 * @constructor
 */
function IntegrationsSection() {
  const state = useSelector(getLoggedInUser);
  const platforms = getPlatforms();

  function isConnected(platform: Platform): boolean {
    return state.enabledIntegrations.includes(platform);
  }

  return (
    <div>
      <DisconnectIntegrationsPopup/>

      <h3 className="mt-8">Donation alerts</h3>
      <p>
        Do you want to receive donation alerts on your Twitch stream?
        Connect the following accounts now!
      </p>

      <table className="mt-4">
        {platforms.map((platform) => {
          return <IntegrationRow
            key={platform.toString()}
            platform={platform}
            connected={isConnected(platform)}
          />
        })}
      </table>


    </div>
  )
}

export default IntegrationsSection;