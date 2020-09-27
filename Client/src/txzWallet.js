import { ThanosWallet } from "@thanos-wallet/dapp";

const txzWallet = async() => {
    try {
      const available = await ThanosWallet.isAvailable();
      if (!available) {
      throw new Error("Thanos Wallet not installed");
      }
      const wallet = new ThanosWallet("Bifrost Baker");
      await wallet.connect("carthagenet");
      return wallet;
    } catch (err) {
        console.error(err);
    }
  }

export default txzWallet;
