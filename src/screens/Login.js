import React from 'react';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

function Login() {
  function onClickLogin() {
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: QRCodeModal,
    });

    if (!connector.connected) {
      connector.createSession();
    }

    connector.on('connect', (error, payload) => {
      if (error) {
        console.log(error);
      }

      const { accounts, chainId} = payload.params[0];
      console.log(accounts[chainId], chainId)
    });
  }

  return (
    <div>
      <h1>Login inside Desmos Tip Bot!</h1>
      <button className="btn-orange" onClick={onClickLogin}>Login</button>
    </div>
  );
}

export default Login;