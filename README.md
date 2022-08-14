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

### Generating a signature and verifying the user

```js
import { generateSignature, verifyUser } from '@zachterrell57/farcaster-auth';

const credentials = generateSignature();

const signature = credentials.signature;
const address = credentials.address;
```



### Verifying the user
```js 
const username = 'username';

const verified = verifyUser(username, address);
```
