const got = require('got');

module.exports = function(zuoraClient) {
  return {
    create: async product => {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.serverUrl}/v1/object/product`;
      const query = {
        body: product,
        headers,
        json: true
      };
      return got.post(url, query).then(res => res.body).catch(zuoraClient.catcher);
    },
    update: async (id, product) => {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.serverUrl}/v1/object/product/${id}`;
      const query = {
        body: product,
        headers,
        json: true,
        resolveBodyOnly: true
      };
      return got.put(url, query).then(res => res.body).catch(zuoraClient.catcher);
    },
    get: productId => zuoraClient.getObject('/v1/object/product/' + productId)
  };
};
