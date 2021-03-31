import React, { useState, useEffect } from "react";

import Web3 from "web3";
const App = () => {
  const web3 = new Web3(window.ethereum);

  const fromAddress = "0xD98B11c92aFC66Dd45E540A1AC17Bdf60beB2d18";
  const nonce = 0;
  const spender = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";
  const createPermitMessageData = function () {
    const message = {
      holder: fromAddress,
      spender: spender,
      nonce: nonce,
    };

    const EIP712DomainType = [
      {
        name: "name",
        type: "string",
      },
      {
        name: "version",
        type: "string",
      },
      {
        name: "chainId",
        type: "uint256",
      },
      {
        name: "verifyingContract",
        type: "address",
      },
    ];

    const PermitType = [
      {
        name: "holder",
        type: "address",
      },
      {
        name: "spender",
        type: "address",
      },
      {
        name: "nonce",
        type: "uint256",
      },
    ];

    const EIP712Domain = {
      name: "Dai Stablecoin",
      version: "1",
      chainId: 42,
      verifyingContract: "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3",
    };

    const typedData = JSON.stringify({
      types: {
        EIP712Domain: EIP712DomainType,
        Permit: PermitType,
      },
      primaryType: "Permit",
      domain: EIP712Domain,
      message: message,
    });

    console.log(typedData);

    return {
      typedData,
      message,
    };
  };

  const signData = async function (web3, fromAddress, typeData) {
    return new Promise(function (resolve, reject) {
      web3.currentProvider.sendAsync(
        {
          id: 1,
          method: "eth_signTypedData_v3",
          params: [fromAddress, typeData],
          from: fromAddress,
        },
        function (err, result) {
          if (err) {
            reject(err); //TODO
          } else {
            const r = result.result.slice(0, 66);
            const s = "0x" + result.result.slice(66, 130);
            const v = Number("0x" + result.result.slice(130, 132));
            resolve({
              v,
              r,
              s,
            });
          }
        }
      );
    });
  };

  const signTransferPermit = async function () {
    const messageData = createPermitMessageData();
    const sig = await signData(web3, fromAddress, messageData.typedData);
    console.log(messageData, sig);
    return Object.assign({}, sig, messageData.message);
  };
  return (
    <div>
      <button onClick={signTransferPermit}>TEST</button>
    </div>
  );
};

export default App;
