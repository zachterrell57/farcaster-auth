# farcaster-auth

<!-- Installation section -->
## Setup

First, ensure that the following are installed globally on your machine:

- [Node.js 16+](https://github.com/nvm-sh/nvm)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)

```bash
yarn add @zachterrell57/farcaster-auth
```

## Usage

### Generating a signature

```js
import { generateSignature, verifyUser } from '@zachterrell57/farcaster-auth';

const credentials = generateSignature();

const signature = credentials.signature;
const address = credentials.address;
```

### Casting the signature to Farcaster
It is now up to the user to post the signature to Farcaster. Until v2 of the protocol, it is probably easiest
to post from the Merkle Manufactory app. Clients can help the user achieve this by helping them copy the signature
to the clipboard, and providing an `Open Farcaster` button that will open the Merkle app for the user. Users should make 
sure not to edit with the signature, as this will result in a failed authentication


### Verifying the user
```js 
const username = 'username';

const verified = verifyUser(username, address);
```

## Persistence
After the user is verified, the client is free to store this information in any way. Some options include:
- Creating an `authed` property on a User object in a centralized DB. This will allow the user to log in via a traditional
email and password flow (or magic link), which means the user will remain authenticated across devices and sessions
- Using cookies to persist authentication. This will work if the user only wishes to use the client from one device, but will
  fail if the client is accessed from a different device (as the cookies are device-specific)
