import {useDispatch, useSelector} from "react-redux";
import {getTipsState} from "store/dashboard/tips/root";

function TipsEnabledSection() {
  const dispatch = useDispatch();
  const state = useSelector(getTipsState);

  return (
    <div>
      <p>Currently your have allowed DesmosTipBot to send at most {state.grantedAmount?.amount} DSM</p>
    </div>
  )
}

export default TipsEnabledSection;