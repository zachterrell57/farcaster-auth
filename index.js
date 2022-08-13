import got from "got";
import { ethers } from "ethers";

//function that parses a string and looks for the signature between the square brackets
function parseSignature(message) {
  const sigStart = message.indexOf("[");
  if (sigStart === -1) {
    throw new Error("Signature not found");
  }
  const sigEnd = message.indexOf("]", sigStart);
  if (sigEnd === -1) {
    throw new Error("Signature not found");
  }
  return message.substring(sigStart + 1, sigEnd);
}

//function that recovers the public key from a signature
async function recoverPublicKey(signature) {
  const messageHash = ethers.utils.keccak256(
    //This is the message that was signed
    ethers.utils.toUtf8Bytes("This is a message")
  );
  try {
    const recoveredAddress = ethers.utils.recoverAddress(
      messageHash,
      signature
    );
    return recoveredAddress;
  } catch (error) {
    console.log(error);
  }
}

function comparePublicKeys(recoveredPublicKey, senderPublicKey) {
  return recoveredPublicKey === senderPublicKey;
}

export default async function verifyUser(username, publicKey) {
  //This is the address of FarcasterAuth
  const farcasterAddress = "0x156d39254FAb024802da070F4D51CACa1ed48A17";
  const farcasterUsername = "farcasterauth";
  const notificationsApi = `https://api.farcaster.xyz/indexer/notifications/${farcasterAddress}?per_page=10`;

  const apiRes = await got(notificationsApi);
  const notifications = JSON.parse(apiRes.body);

  let verified = false;

  //Only check the mentions from given username
  const mentions = notifications.filter(
    (notification) =>
      notification.type === "mention" &&
      notification.data.castText.includes(`@${farcasterUsername}`) &&
      notification.user.username === username
  );

  // Iterate over all mentions and store the one with the highest timestamp
  let latest = mentions[0];
  mentions.forEach((mention) => {
    if (mention.timestamp > latest.timestamp) latest = mention;
  });

  //Parse the signature from the message and recover the public key
  const signature = parseSignature(latest.data.castText);
  const recoveredPublicKey = await recoverPublicKey(signature);

  // If the recovered public key is the same as the public key of the sender, the user is verified
  if (comparePublicKeys(publicKey, recoveredPublicKey)) verified = true;

  return verified;
}

export default async function generateSignature() {
  //create a random wallet with ethers and then generate a signature
  const wallet = ethers.Wallet.createRandom();
  const messageHash = ethers.utils.keccak256(utils.toUtf8Bytes("This is a message"));
  const signature = ethers.utils.joinSignature(
    wallet._signingKey().signDigest(messageHash)
  );
  return {signature: signature, address: wallet.address};
}
