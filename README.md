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
It is now up to the user to cast the signature to Farcaster. Until v2 of the protocol, it is probably easiest
to post from the Merkle Manufactory app. Clients can help the user achieve this by helping them copy the signature
to the clipboard, and providing an `Open Farcaster` button that will open the Merkle app for the user. Users should make sure not to edit the signature, as this will result in a failed authentication

This cast might look something like:
![IMG_B3C35EE69C68-1](https://user-images.githubusercontent.com/49534342/185194703-4fa8b987-2a4d-4728-9f09-be2436f58e7c.jpeg)

### Post visibility
If you are worried that the frequency of auth casts from your users might result in clogged timelines, you can alter the auth cast to lead with the app username, e.g. `@unloney <auth message>`. If the auth cast is the parent cast and you don't follow the mentioned account, then the cast won't appear on your timeline. We can alter the example above to reflect this:
![IMG_20237C693EFB-1](https://user-images.githubusercontent.com/49534342/185197305-889cb0ad-fa4a-4ce5-96ab-03153f310c74.jpeg)

If you wanted to go further, you could even create a specific "auth" account for your app, e.g. `@instacasterAuth` or `@unlonelyAuth` and encourage people not to follow these accounts.

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
