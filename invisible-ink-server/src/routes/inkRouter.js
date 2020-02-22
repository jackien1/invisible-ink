const express = require("express");
const router = express.Router();
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
const SchoolManager = require("../ethereum/contracts/SchoolManager.json");
const School = require("../ethereum/contracts/School.json");
const Ink = require("../ethereum/contracts/Ink.json");

router.get("/", (req, res) => {
  res.status(200);
  res.send("Authentication API");
});

router.post("/getClubs", async (req, res) => {
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

  let schoolInstance = new web3.eth.Contract(
    School.abi,
    School.networks["9545242630824"].address,
    { from: address }
  );

  try {
    let clubs = await schoolInstance.methods.getDeployedClubs().call();

    const result = await clubs.map(async club => {
      const contract = new web3.eth.Contract(Club.abi, club);
      const details = await contract.methods.getDetails().call({
        from: address
      });
      const user = await User.findOne({ address: details[4].toLowerCase() });
      return { ...details, address: club, name: user.name };
    });

    const finishedResult = await Promise.all(result);

    res.status(200).json({
      clubs: finishedResult
    });
  } catch (e) {
    console.log(e);
    res.status(404);
  }
});

router.post("/myEvents", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
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

  let schoolInstance = new web3.eth.Contract(
    School.abi,
    School.networks["9545242630824"].address,
    { from: user.address }
  );

  try {
    const result = await user.clubs.map(async club => {
      const contract = new web3.eth.Contract(Club.abi, club);
      const details = await contract.methods.getDetails().call({
        from: user.address
      });

      const events = new Array(Number(details[8]));
      let newEvents = [];
      for (let i = 0; i < events.length; i++) {
        let eventMeta = await contract.methods
          .getOccurrence(i)
          .call({ from: user.address });
        newEvents.push({ ...eventMeta });
      }

      const owner = await User.findOne({ address: details[4].toLowerCase() });
      return { ...details, address: club, name: owner.name, newEvents };
    });
    const finishedResult = await Promise.all(result);
    res.status(200).json({
      clubs: finishedResult
    });
  } catch (e) {
    console.log(e);
    res.status(404);
  }
});

router.post("/myClubs", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
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

  let schoolInstance = new web3.eth.Contract(
    School.abi,
    School.networks["9545242630824"].address,
    { from: user.address }
  );

  try {
    const result = await user.clubs.map(async club => {
      const contract = new web3.eth.Contract(Club.abi, club);
      const details = await contract.methods.getDetails().call({
        from: user.address
      });

      const owner = await User.findOne({ address: details[4].toLowerCase() });
      return { ...details, address: club, name: owner.name };
    });
    const finishedResult = await Promise.all(result);

    res.status(200).json({
      clubs: finishedResult
    });
  } catch (e) {
    console.log(e);
    res.status(404);
  }
});

router.post("/createClub", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
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

  let schoolInstance = new web3.eth.Contract(
    School.abi,
    School.networks["9545242630824"].address
  );

  try {
    await schoolInstance.methods
      .createClub(
        req.body.exclusive,
        req.body.description,
        req.body.title,
        req.body.imageUri,
        req.body.goal
      )
      .send({
        from: user.address
      });

    let clubs = await schoolInstance.methods
      .getDeployedClubs()
      .call({ from: user.address });
    user.clubs.push(clubs[clubs.length - 1]);
    await user.save();

    res.status(201).json({
      success: true
    });
  } catch (e) {
    console.log(e);
    res.status(404);
  }
});

router.post("/joinClub", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
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

  const contract = new web3.eth.Contract(Club.abi, req.body.address);
  await contract.methods.joinClub().send({
    from: user.address
  });

  user.clubs.push(req.body.address);
  await user.save();

  try {
    res.status(200).json({
      success: true
    });
  } catch (e) {
    console.log(e);
    res.status(404);
  }
});

module.exports = router;
