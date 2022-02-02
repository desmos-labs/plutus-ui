import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {getAuthorizationToken} from "../apis/oauth";
import {Keys, Store} from "../store";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Success() {
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = async () => {
    // Get the params for the API call
    const oAuthCode = searchParams.get('code');
    const desmosAddress = Store.getValue(Keys.DesmosAddress)

    // Get the authorization token
    const res = await getAuthorizationToken(desmosAddress, oAuthCode);
    if (!res.ok) {
      setError(await res.text());
    }

    setLoading(false);
  }

  useEffect(() => {
    if (loading) {
      getToken();
    }
  }, []);


  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <p>Success!</p>
    </div>
  );
}

export default Success;