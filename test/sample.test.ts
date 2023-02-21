import Harbor from "@harbor-xyz/harbor";
import { Testnet } from "@harbor-xyz/harbor/dist/harbor_sdk/types";
import { expect } from "chai";

describe("Harbor Sample Test", function () {
  let harbor: Harbor;
  let testnetName: unknown;
  let testnet: Testnet;

  beforeAll(async () => {
    testnetName = "connext-testnet";

    // add your userKeys and projectKeys here!
    harbor = new Harbor({
      userKey: "",
      projectKey: "",
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
    for (const key in offChainActors) {
      const actor = offChainActors[key];
      expect(actor.status).to.equal("RUNNING");
    }
  });

  it("Restart routerCache", async function () {
    testnet = await harbor.stop(testnet.name, "routerCache");
    let offChainActors = testnet.offChainActors();
    const actor = offChainActors["routerCache"];
    expect(actor.status).to.equal("STOPPED");
    testnet = await harbor.start(testnet.name, "routerCache");
    offChainActors = testnet.offChainActors();
    const start_actor = offChainActors["routerCache"];
    expect(start_actor.status).to.equal("RUNNING");
  });

  it("Assert and print sequencerSubscriber log", async function () {
    if (typeof testnetName === "string") {
      testnet = await harbor.testnet(testnetName);
      const offChainActors = testnet.offChainActors();
      let success = false;
      const actor = offChainActors["sequencerSubscriber"];
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
