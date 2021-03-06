const got = require('got');

module.exports = (zuoraClient) => {
	return {
		create: (data) => {
			return zuoraClient.authenticate().then((headers) => {
				const url = zuoraClient.serverUrl + '/v1/object/bill-run';
				const query = {
					body: data,
					headers,
					json: true,
				};
				return got
					.post(url, query)
					.then((res) => res.body)
					.catch(zuoraClient.catcher);
			});
		},
		get: (billRunId) => {
			return zuoraClient.authenticate().then((headers) => {
				const url = zuoraClient.serverUrl + '/v1/object/bill-run/' + billRunId;
				const query = {
					headers,
					json: true,
				};
				return got
					.get(url, query)
					.then((res) => res.body)
					.catch(zuoraClient.catcher);
			});
		},
		post: (billRunId) => {
			return zuoraClient.authenticate().then((headers) => {
				const url = zuoraClient.serverUrl + '/v1/object/bill-run/' + billRunId;
				const query = {
					body: { Status: 'Posted' },
					headers,
					json: true,
				};
				return got
					.put(url, query)
					.then((res) => res.body)
					.catch(zuoraClient.catcher);
			});
		},
		cancel: (billRunId) => {
			return zuoraClient.authenticate().then((headers) => {
				const url = zuoraClient.serverUrl + '/v1/object/bill-run/' + billRunId;
				const query = {
					body: { Status: 'Canceled' },
					headers,
					json: true,
				};
				return got
					.put(url, query)
					.then((res) => res.body)
					.catch(zuoraClient.catcher);
			});
		},
		delete: (billRunId) => {
			return zuoraClient.authenticate().then((headers) => {
				const url = zuoraClient.serverUrl + '/v1/object/bill-run/' + billRunId;
				const query = {
					headers,
					json: true,
				};
				return got
					.delete(url, query)
					.then((res) => res.body)
					.catch(zuoraClient.catcher);
			});
		},
	};
};
