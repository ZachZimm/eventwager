const EventWager = artifacts.require("EventWager");
const Token = artifacts.require("Token");

module.exports = async function (deployer)
{
    await deployer.deploy(Token);
    const token = await Token.deployed(); // Assign to a variable so we can access token.address
    await deployer.deploy(EventWager, token.address);
    const eventWager = await EventWager.deployed(); // Assign EventWager to a variable so we can do something like
    // await token.passMinterRole(helloWorld.address)
    await token.transferOwnership(eventWager.address)
};