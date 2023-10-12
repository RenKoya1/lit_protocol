import { createContext, useContext, useState } from "react";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
type LC = {
  client: LitJsSdk.LitNodeClient | null;
  jwt: string;
  jwtConnect: () => void;
};

const LitContext = createContext<LC>({} as LC);
export const accessControlConditions = [
  {
    contractAddress: "0xAc67466ec868025Ca3D1aaBFe54E5B13Cd0a4275",
    standardContractType: "ERC721",
    chain: "mumbai",
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

export const useLit = (): LC => useContext(LitContext);

export function LitContextProvider(props: any) {
  const [client, setClient] = useState<LitJsSdk.LitNodeClient | null>(null);
  const [jwt, setJwt] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [dataToEncryptHash, setDataToEncryptHash] = useState<string>("");
  async function jwtConnect() {
    const litNodeClient = new LitJsSdk.LitNodeClient({});
    await litNodeClient.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    setClient(litNodeClient);
    try {
      const _jwt = await litNodeClient.getSignedToken({
        accessControlConditions,
        chain: "mumbai",
        authSig,
      });
      setJwt(_jwt);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function encrypto() {
    if (!client) return;
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    try {
      const result = await LitJsSdk.encryptString(
        {
          accessControlConditions,
          authSig,
          chain: "mumbai",
          dataToEncrypt: "this is a secret message",
        },
        client
      );
      setCiphertext(result.ciphertext);
      setDataToEncryptHash(result.dataToEncryptHash);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function decrypt() {
    if (!client) return;
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    const decryptedString = LitJsSdk.decryptToString(
      {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain: "mumbai",
      },
      client
    );
    return { decryptedString };
  }

  return (
    <>
      <LitContext.Provider
        value={{
          jwt,
          client,
          jwtConnect,
        }}
      >
        {props.children}
      </LitContext.Provider>
    </>
  );
}
