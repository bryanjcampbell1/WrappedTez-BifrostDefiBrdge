import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...

      let web3, infuraProvider;

      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
        } catch (error) {
          reject(error);
        }
      }

      infuraProvider = new Web3(
				new Web3.providers.HttpProvider(
					"https://kovan.infura.io/v3/50c1b6482c9f47b08dcab7b1500f5e24"
				)
			);
			resolve({web3,infuraProvider});

  });
});

export default getWeb3;
