# farcaster-auth

<!-- Installation section -->
## Setup

```bash
yarn add @zachterrell57/farcaster-auth
```

## Usage

### Generating a signature and verifying the user

```js
import { generateSignature, verifyUser } from '@zachterrell57/farcaster-auth';

const credentials = generateSignature();

const signature = credentials.signature;
```



### Verifying the user
```js 
const username = 'username';

const verified = verifyUser(username, address);
```