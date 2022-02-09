import * as React from 'react';

function TipsPage() {
  return (
    <div className="p-[10px]">
      <p>In order to enable tips, you need to sign a transaction using Wallet connect.</p>
      <button className="btn-orange">Sign transaction</button>
    </div>
  )
}

export default TipsPage;