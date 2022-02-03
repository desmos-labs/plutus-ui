import {AppThunk} from "store/index";
import {Platform} from "types/oauth";
import {setError, setLoading} from "store/oauth/index";
import {StreamlabsAPIs} from "apis/streamlabs";

export const startAuthorization = (platform: Platform): AppThunk => {
  return _ => {
    if (platform != Platform.STREAMLABS) {
      // TODO: Handle this
    }

    StreamlabsAPIs.startConnection()
  }
}

export const sendAuthorizationCode = (platform: Platform, oAuthCode: string, desmosAddress: string): AppThunk => {
  return async dispatch => {
    if (platform != Platform.STREAMLABS) {
      // TODO: Enable other platforms as well
      dispatch(setError("Invalid platform. Only supported is Streamlabs"))
      return
    }

    dispatch(setLoading(true))
    dispatch(setError(undefined))

    // Get the authorization code
    const res = await StreamlabsAPIs.sendAuthorizationCode(desmosAddress, oAuthCode)
    if (!res.ok) {
      dispatch(setError(await res.text()))
      return
    }

    dispatch(setLoading(false))
  }
}