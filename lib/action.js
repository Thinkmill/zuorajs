const got = require('got');

module.exports = zuoraClient => {
  return {
    subscribe: subscribeData => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/action/subscribe';
        const query = {
          body: subscribeData,
          headers,
          json: true
        };
        return got
          .post(url, query)
          .then(res => res.body)
          .catch(zuoraClient.catcher);
      });
    },
    query: queryString => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/action/query';
        const data = {
          queryString: queryString
        };
        const query = {
          body: data,
          headers,
          json: true
        };
        return got
          .post(url, query)
          .then(res => {
            return res.body;
          })
          .catch(zuoraClient.catcher);
      });
    },
    queryMore: queryLocator => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/action/queryMore';
        const query = {
          body: {
            queryLocator
          },
          headers,
          json: true
        };
        return got
          .post(url, query)
          .then(res => res.body)
          .catch(zuoraClient.catcher);
      });
    },
    delete: (type, ids) => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/action/delete';
        const query = {
          body: {
            type,
            ids
          },
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body).catch(zuoraClient.catcher);
      });
    },
    update: (type, objects) => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/action/update';
        const query = {
          body: {
            type,
            objects
          },
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body).catch(zuoraClient.catcher);
      });
    }
  };
};
