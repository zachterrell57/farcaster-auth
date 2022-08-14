import got from "got";
import { Wallet, utils } from "ethers";
//function that parses a string and looks for the signature between the square brackets
function parseSignature(message) {
  const sigStart = message.indexOf("[");
  if (sigStart === -1) {
    throw new Error("Malfomed message");
  }
  const sigEnd = message.indexOf("]", sigStart);
  if (sigEnd === -1) {
    throw new Error("Malfomed message");
  }
  return message.substring(sigStart + 1, sigEnd);
}

//function that recovers the address from a signature
async function recoverAddress(signature) {
  const messageHash = utils.keccak256(
    //This is the message that was signed
    utils.toUtf8Bytes("This is a message")
  );
  try {
    const recoveredAddress = utils.recoverAddress(messageHash, signature);
    return recoveredAddress;
  } catch (error) {
    console.log(error);
  }
}

function compareAddress(recoveredAddress, senderAddress) {
  return recoveredAddress === senderAddress;
}

export async function verifyUser(username, address) {
  if (username === "" || username === undefined || username === null) {
    throw new Error("Username is required");
  }
  if (address === "" || address === undefined || address === null) {
    throw new Error("Public key is required");
  }
  //This is the address of FarcasterAuth
  const farcasterAddress = "0x156d39254FAb024802da070F4D51CACa1ed48A17";
  const farcasterUsername = "farcasterauth";
  const notificationsApi = `https://api.farcaster.xyz/indexer/notifications/${farcasterAddress}?per_page=10`;

  const apiRes = await got(notificationsApi);
  const notifications = JSON.parse(apiRes.body);

  //Only check the mentions from given username
  const mentions = notifications.filter(
    (notification) =>
      notification.type === "mention" &&
      notification.data.castText.includes(`@${farcasterUsername}`) &&
      notification.user.username === username
  );

  if (mentions.length === 0) {
    throw new Error("No mentions found");
  }

  // Iterate over all mentions and store the one with the highest timestamp
  let latest = mentions[0];
  mentions.forEach((mention) => {
    if (mention.timestamp > latest.timestamp) latest = mention;
  });

  //Parse the signature from the message and recover the public key
  const signature = parseSignature(latest.data.castText);
  const recoveredAddress = await recoverAddress(signature);

  // If the recovered address is the same as the address of the sender, the user is verified
  return compareAddress(publicKey, recoveredAddress);
}

export async function generateSignature() {
  //create a random wallet with ethers and then generate a signature
  const wallet = Wallet.createRandom();
  const messageHash = utils.keccak256(utils.toUtf8Bytes("This is a message"));
  const signature = utils.joinSignature(
    wallet._signingKey().signDigest(messageHash)
  );
  return { signature: signature, address: wallet.address };
}
