import {Platform} from "../../../types";
import * as React from "react";
import streamlabsIcon from "../../../assets/icons/streamlabs.svg"
import streamElementsIcon from "../../../assets/integrations/streamelements.png"
import {useDispatch, useSelector} from "react-redux";
import {startAuthorization} from "../../../store/oauth";
import {startDisconnection} from "../../../store/integrations";
import DashboardRow from "../components/DashboardRow";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import {getLoggedInUser} from "../../../store/user";

interface IntegrationProps {
  readonly platform: Platform;
  readonly disabled: boolean;
}

/**
 * Represents a single integration row.
 */
function IntegrationRow({platform, disabled}: IntegrationProps) {
  const state = useSelector(getLoggedInUser);
  const connected = state.enabledIntegrations.includes(platform);

  const dispatch = useDispatch();
  const icons: Map<Platform, string> = new Map<Platform, string>([
    [Platform.STREAMLABS, streamlabsIcon],
    [Platform.STREAMELEMENTS, streamElementsIcon],
  ])

  function handleClickDisconnect() {
    dispatch(startDisconnection(platform));
  }

  function handleClickConnect() {
    dispatch(startAuthorization(platform));
  }

  return (
    <DashboardRow
      icon={icons.get(platform) || ""}
      title={platform.toString()}
      text={`Connect your ${platform.toString()} account to start receiving donation alerts`}
      button={
        <div>
          {connected &&
            <PrimaryButton className="button-red" onClick={handleClickDisconnect}>
              Disconnect
            </PrimaryButton>
          }

          {!connected && !disabled &&
            <PrimaryButton onClick={handleClickConnect}>
              Connect
            </PrimaryButton>
          }

          {!connected && disabled &&
            <PrimaryButton disabled onClick={handleClickConnect}>
              Coming soon
            </PrimaryButton>
          }
        </div>
      }
    />
  )
}

export default IntegrationRow;