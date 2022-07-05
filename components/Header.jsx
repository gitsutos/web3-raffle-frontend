import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const Header = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();
  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, [isWeb3Enabled]);
  return (
    <>
      <h1>Header</h1>
      <div>
        {account ? (
          <div>
            connected to: {account.slice(0, 6)}...{account.slice(-4)}
            <h2>{window.localStorage.getItem("connected")}</h2>
          </div>
        ) : (
          <button
            onClick={async () => {
              await enableWeb3();
              if (isWeb3Enabled)
                window.localStorage.setItem("connected", "injected");
            }}
            disabled={isWeb3EnableLoading}
          >
            Connect
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
