import Harbor from "@harbor-xyz/harbor";
import { Testnet } from "@harbor-xyz/harbor/dist/harbor_sdk/types";
import { expect } from "chai";

describe("Harbor Sample Test", function () {
  let harbor: Harbor;
  let testnetName: unknown;
  let testnet: Testnet;

  beforeAll(async () => {
    testnetName = "TESTNET_NAME";

    harbor = new Harbor({
      userKey: "USER_KEY",
      projectKey: "PROJECT_KEY",
    });
    await harbor.authenticate();
    if (typeof testnetName === "string") {
      testnet = await harbor.clone("protocol-Connext", testnetName);
    }
  });

  it("Checks if the Testnet exists", async () => {
    console.log("\n\n==========testnet==========");
    console.log(testnet);

    expect(testnet.status).to.equal("RUNNING");
  });

  it("Checks if the Ethereum chain exists", async () => {
    const chain = testnet.ethereum;
    console.log(chain);
    expect(chain.status).to.equal("RUNNING");
    console.log(
      `${chain.chain} - ${chain.id} - ${chain.status} - ${chain.endpoint}`
    );
  });

  it("Checks if the Polygon chain exists", async () => {
    const chain = testnet.polygon;
    console.log(chain);
    expect(chain.status).to.equal("RUNNING");
    console.log(
      `${chain.chain} - ${chain.id} - ${chain.status} - ${chain.endpoint}`
    );
  });

  it("Checks if the Offchain actors exists", async function () {
    const offChainActors = testnet.offChainActors();
    console.log(
      `\n\n==========offChainActors(${
        Object.keys(offChainActors).length
      })==========`
    );
    console.log(offChainActors);
    for (const key in offChainActors) {
      const actor = offChainActors[key];
      expect(actor.status).to.equal("RUNNING");
      console.log(
        `${actor.name} - ${actor.status} - ${actor.ports()} - ${actor.endpoint}`
      );
    }
  });

  it("Restart router-cache", async function () {
    console.log("Stopping router-cache");
    testnet = await harbor.stop(testnet.name, "routerCache");
    let offChainActors = testnet.offChainActors();
    const actor = offChainActors.routerCache;
    console.log(`${actor.name} - ${actor.status}`);
    expect(actor.status).to.equal("STOPPED");

    console.log("Starting router-cache");
    testnet = await harbor.start(testnet.name, "routerCache");
    offChainActors = testnet.offChainActors();
    const start_actor = offChainActors.routerCache;
    console.log(
      `${start_actor.name} - ${start_actor.status} - ${start_actor.ports()} - ${
        start_actor.endpoint
      }`
    );
    expect(start_actor.status).to.equal("RUNNING");
  });

  it("Assert and print sequencer-subscriber log", async function () {
    if (typeof testnetName === "string") {
      testnet = await harbor.testnet(testnetName);
      const offChainActors = testnet.offChainActors();
      let success = false;
      const actor = offChainActors.sequencerSubscriber;
      await actor.logs().then((logs) => {
        logs.forEach((log) => {
          if (log.message.includes("Sequencer config generated.")) {
            console.log(log);
            success = true;
          }
        });
      });
      expect(success).to.equal(true);
    }
  });
});
