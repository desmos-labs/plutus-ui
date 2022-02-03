import {AppThunk} from "store/index";
import {Donation} from "types/donation";
import {DonationsAPI} from "apis/donations";
import {setError, setLoading} from "store/donation/index";

/**
 * Allows donating to a user.
 */
export const sendDonation = (donation: Donation): AppThunk => {
  return async dispatch => {
    dispatch(setLoading(true))
    dispatch(setError(undefined))

    const res = await DonationsAPI.donate(donation)
    if (!res.ok) {
      dispatch(setError(await res.text()))
      return
    }

    dispatch(setLoading(false))
  }
}