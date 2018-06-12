module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      gas: 900000,
      gasPrice: 6712388,
      network_id: "*" // Match any network id
    }
  }
};