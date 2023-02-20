# Connext Harbor test

## Overview

Connext is an available bridge to clone on Harbor's Testnet. The `test/sample.test.ts` runs tests against an already cloned Connext bridge. The tests go over the following: 

- Checking if the Testnet exist
- Checking if the Chains exist
- Checking if the Offchain actors exists
- Stopping and starting the `router-cache` off-chain actor
- Asserts and prints `sequencer-subscriber` log

## Set up
Install the packages with your favourite package manager:

```bash
# npm
npm install

# yarn
yarn install
```

## Running the tests
After installing the packages, you can execute the test, by running:

```bash
yarn jest
```