import {Platform} from "../../types";
import * as React from "react";
import streamlabsIcon from "assets/integrations/streamlabs.png"
import streamElementsIcon from "assets/integrations/streamelements.png"
import {useDispatch} from "react-redux";
import {startAuthorization} from "../../store/oauth";

interface IntegrationProps {
  readonly platform: Platform;
  readonly connected: boolean;
}

/**
 * Represents a single integration row.
 */
function IntegrationRow({platform, connected}: IntegrationProps) {
  const dispatch = useDispatch();
  const icons: Map<Platform, string> = new Map<Platform, string>([
    [Platform.STREAMLABS, streamlabsIcon],
    [Platform.STREAMELEMENTS, streamElementsIcon],
  ])

  function handleClickDisconnect() {
    // TODO: Implement this
  }

  function handleClickConnect() {
    dispatch(startAuthorization(platform));
  }

  return (
    <tr>
      <td className="text-center p-3">
        <img
          className="mx-auto my-1 w-10 h-10"
          src={icons.get(platform)}
          alt={`${platform.toString()} Logo`}
        />
        <p>{platform.toString()}</p>
      </td>

      <td className="text-center p-3">
        {connected &&
          <button className="button-red text-sm" onClick={handleClickDisconnect}>
            Disconnect {platform.toString()}
          </button>
        }

        {!connected && platform != Platform.STREAMELEMENTS &&
          <button className="disabled text-sm" onClick={handleClickConnect}>
            Connect {platform.toString()}
          </button>
        }
        {!connected && platform == Platform.STREAMELEMENTS &&
          <button disabled className="disabled text-sm" onClick={handleClickConnect}>
            Coming soon
          </button>
        }
      </td>
    </tr>
  )
}

export default IntegrationRow;