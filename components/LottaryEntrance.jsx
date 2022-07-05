import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";

import { useNotification } from "web3uikit";
import { ethers } from "ethers";

const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const raffleAddress = contractAddresses[chainId]
    ? contractAddresses[chainId][0]
    : null;

  const [entranceFee, setEntranceFee] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [recentWinner, setRecentWinner] = useState("0x");
  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      // stand alone function
      updateUI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3Enabled]);

  async function updateUI() {
    const entranceFeeFomCall = (await getEntranceFee()).toString();
    const numOfPlayersFomCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFomCall = (await getRecentWinner()).toString();
    setEntranceFee(entranceFeeFomCall.toString());
    setNumberOfPlayers(numOfPlayersFomCall);
    setRecentWinner(recentWinnerFomCall);
  }

  function handleNewNotification(tx) {
    dispatch({
      type: "info",
      message: "Transaction Success!",
      title: "Tx Notification",
      icon: "bell",
      position: "topR",
    });
  }

  async function handleSuccess(tx) {
    //empty
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  }

  return (
    <div className="p-5">
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-200 hover:bg-blue-400 text-gray-800 border border-blue-500 font-bold py-2 px-4 rounded"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (err) => console.error(err),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full border-blue-800"></div>
            ) : (
              <div> Enter raffle</div>
            )}
          </button>

          <div>Entrance Fee: 0.1 ETH</div>
          <div>Players: {numberOfPlayers}</div>
          <div>RecentWinner: {recentWinner}</div>
        </div>
      ) : (
        <h1>only rinkeby and local host rpc networks are supported!</h1>
      )}
    </div>
  );
};

export default LotteryEntrance;
