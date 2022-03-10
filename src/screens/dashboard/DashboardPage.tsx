import * as React from "react";
import OAuthPopup from "./popups/OAuthPopup";
import { getPlatforms, Platform } from "../../types";
import IntegrationRow from "./integrations/IntegrationRow";
import DisconnectIntegrationsPopup from "./popups/DisconnectIntegrationsPopup";
import GrantAmountPopup from "./popups/GrantAmountPopup";
import TipsRow from "./tips/TipsRow";

/**
 * Represents the dashboard of the app for logged in users.
 * @returns {JSX.Element}
 * @constructor
 */
function DashboardPage() {
  const platforms = getPlatforms();

  return (
    <div>
      <h1 className="font-semibold">Dashboard</h1>
      <p>Welcome to your dashboard, where you can manage your settings.</p>

      <div className="mt-5 space-y-5">
        {platforms.map((platform) => (
          <IntegrationRow
            key={platform}
            platform={platform}
            disabled={platform !== Platform.STREAMLABS}
          />
        ))}

        <TipsRow />
      </div>

      <DisconnectIntegrationsPopup />
      <GrantAmountPopup />
      <OAuthPopup />
    </div>
  );
}

export default DashboardPage;
