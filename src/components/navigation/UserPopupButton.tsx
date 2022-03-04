import {ReactComponent as UserIcon} from "../../assets/icons/user.svg";
import {useDispatch, useSelector} from "react-redux";
import {getLoggedInUser} from "../../store/user";
import {getDisplayName} from "../utils";
import NavigationPopup from "./NavigationPopup";
import {showPopup} from "../../store/navigation";

/**
 * Represents the button that should be used to open the user popup.
 * @constructor
 */
function UserPopupButton() {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);

  function handleClickButton() {
    dispatch(showPopup());
  }

  return (
    <div>
      <div className="select-none flex flex-row cursor-pointer" onClick={handleClickButton}>
        <UserIcon className="my-auto mr-2"/>
        <p className="text-sm">{getDisplayName(user.profile)}</p>
      </div>

      <NavigationPopup/>
    </div>
  );
}

export default UserPopupButton;