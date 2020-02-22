const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  CryptoUtils,
  Client,
  NonceTxMiddleware,
  LoomProvider,
  SignedTxMiddleware,
  LocalAddress
} = require("loom-js");
const Web3 = require("web3");
const User = require("../models/user");
const SchoolManager = require("../contracts/SchoolManager.json");
const School = require("../contracts/School.json");
const Ink = require("../contracts/Ink.json");

router.get("/", (req, res) => {
  res.status(200);
  res.send("Authentication API");
});

router.post(
  "/createSchool",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const privateKey = new Uint8Array(JSON.parse("[" + user.privateKey + "]"));
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

    let client = new Client(
      "extdev-plasma-us1",
      "wss://extdev-plasma-us1.dappchains.com/websocket",
      "wss://extdev-plasma-us1.dappchains.com/queryws"
    );

    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ];

    let web3 = new Web3(new LoomProvider(client, privateKey));

    let schoolManagerInstance = new web3.eth.Contract(
      SchoolManager.abi,
      SchoolManager.networks["9545242630824"].address
    );

    try {
      await schoolManagerInstance.methods.createSchool(req.body.name).send({
        from: user.address
      });

      res.status(201).json({
        success: true
      });
    } catch (e) {
      console.log(e);
      res.status(404);
    }
  }
);

router.post("/getSchools", async (req, res) => {
  const privateKey = CryptoUtils.generatePrivateKey();
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
  let address = LocalAddress.fromPublicKey(publicKey).toString();

  let client = new Client(
    "extdev-plasma-us1",
    "wss://extdev-plasma-us1.dappchains.com/websocket",
    "wss://extdev-plasma-us1.dappchains.com/queryws"
  );

  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ];

  let web3 = new Web3(new LoomProvider(client, privateKey));

  let schoolManagerInstance = new web3.eth.Contract(
    SchoolManager.abi,
    SchoolManager.networks["9545242630824"].address,
    { from: address }
  );

  try {
    let schools = await schoolManagerInstance.methods
      .getDeployedSchools()
      .call();

    const result = await schools.map(async school => {
      const contract = new web3.eth.Contract(School.abi, school);
      const details = await contract.methods.getDetails().call({
        from: address
      });

      const user = await User.findOne({ address: details[1].toLowerCase() });
      return { ...details, address: school, email: user.email };
    });

    const finishedResult = await Promise.all(result);

    res.status(200).json({
      schools: finishedResult
    });
  } catch (e) {
    console.log(e);
    res.status(404);
  }
});

router.post(
  "/createInk",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const privateKey = new Uint8Array(JSON.parse("[" + user.privateKey + "]"));
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

    let client = new Client(
      "extdev-plasma-us1",
      "wss://extdev-plasma-us1.dappchains.com/websocket",
      "wss://extdev-plasma-us1.dappchains.com/queryws"
    );

    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ];

    let web3 = new Web3(new LoomProvider(client, privateKey));
    let schoolInstance = new web3.eth.Contract(School.abi, req.body.code);

    try {
      await contract.methods.sendMessage(req.body.text).send({
        from: user.address
      });

      res.status(201).json({
        success: true
      });
    } catch (e) {
      console.log(e);
      res.status(404);
    }
  }
);

router.post(
  "/myInks",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const privateKey = new Uint8Array(JSON.parse("[" + user.privateKey + "]"));
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

    let client = new Client(
      "extdev-plasma-us1",
      "wss://extdev-plasma-us1.dappchains.com/websocket",
      "wss://extdev-plasma-us1.dappchains.com/queryws"
    );

    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ];

    let web3 = new Web3(new LoomProvider(client, privateKey));
    const networkId = client.chainId;
    let schoolInstance = new web3.eth.Contract(School.abi, req.body.code);

    try {
      let inks = await schoolInstance.methods.returnInks().call({
        from: user.address
      });

      const result = await inks.map(async ink => {
        const contract = new web3.eth.Contract(Ink.abi, ink);
        const details = await contract.methods.getDetails().call({
          from: user.address
        });

        const messages = new Array(Number(details[2]));
        let newMessages = [];

        for (let i = 0; i < messages.length; i++) {
          let messageMeta = await contract.methods
            .getMessage(i)
            .call({ from: user.address });

          newMessages.push(messageMeta);
        }

        return {
          ...details,
          address: ink,
          messages: newMessages
        };
      });

      const finishedResult = await Promise.all(result);
      const finalInks = [];

      for (let i = 0; i < finishedResult.length; i++) {
        if (finishedResult[i][3].toLowerCase() == user.address) {
          finalInks.push(finishedResult[i]);
        }
      }

      res.status(200).json({
        inks: finalInks
      });
    } catch (e) {
      console.log(e);
      res.status(404);
    }
  }
);

module.exports = router;
