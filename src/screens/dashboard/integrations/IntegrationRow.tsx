import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { Platform } from "../../../types";
import streamlabsIcon from "../../../assets/icons/streamlabs.svg";
import streamElementsIcon from "../../../assets/icons/streamelements.svg";
import { startAuthorization } from "../../../store/oauth";
import { startDisconnection } from "../../../store/integrations";
import DashboardRow from "../components/DashboardRow";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import { getLoggedInUser } from "../../../store/user";

interface IntegrationProps {
  readonly platform: Platform;
  readonly disabled: boolean;
}

/**
 * Represents a single integration row.
 */
function IntegrationRow({ platform, disabled }: IntegrationProps) {
  const state = useSelector(getLoggedInUser);
  const connected = state.enabledIntegrations.includes(platform);

  const dispatch = useDispatch();
  const icons: Map<Platform, string> = new Map<Platform, string>([
    [Platform.STREAMLABS, streamlabsIcon],
    [Platform.STREAMELEMENTS, streamElementsIcon],
  ]);

  const handleClickDisconnect = useCallback(() => {
    dispatch(startDisconnection(platform));
  }, []);

  const handleClickConnect = useCallback(() => {
    dispatch(startAuthorization(platform));
  }, []);

  return (
    <DashboardRow
      icon={icons.get(platform) || ""}
      title={platform.toString()}
      text={`Connect your ${platform.toString()} account to start receiving donation alerts`}
      button={
        <div>
          {connected && (
            <PrimaryButton
              className="w-full md:w-max-min"
              onClick={handleClickDisconnect}
            >
              Disconnect
            </PrimaryButton>
          )}

          {!connected && !disabled && (
            <PrimaryButton
              className="w-full md:w-max-min"
              onClick={handleClickConnect}
            >
              Connect
            </PrimaryButton>
          )}

          {!connected && disabled && (
            <PrimaryButton
              className="w-full md:w-max-min"
              disabled
              onClick={handleClickConnect}
            >
              Coming soon
            </PrimaryButton>
          )}
        </div>
      }
    />
  );
}

export default IntegrationRow;
