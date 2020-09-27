import Web3 from "web3";

const getInfuraProvider = () =>
	new Promise((resolve, reject) => {
		// Wait for loading completion to avoid race conditions with web3 injection timing.
		window.addEventListener("load", async () => {
			// Modern dapp browsers...
			let infuraProvider;
			infuraProvider = new Web3(
				new Web3.providers.HttpProvider(
					"https://kovan.infura.io/v3/50c1b6482c9f47b08dcab7b1500f5e24"
				)
			);
			resolve(infuraProvider);
		});
	});

export default getInfuraProvider;