const SchoolManager = artifacts.require("SchoolManager");

module.exports = async function(deployer) {
  await deployer.deploy(SchoolManager);

  console.log(SchoolManager.address);
};
