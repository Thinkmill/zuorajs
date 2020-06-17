const got = require('got');

module.exports = function (zuoraClient) {
	return {
		create: async (unitOfMeasure) => {
			const headers = await zuoraClient.authenticate();
			const url = `${zuoraClient.serverUrl}/v1/object/unit-of-measure`;
			const query = {
				body: unitOfMeasure,
				headers,
				json: true,
			};
			return got
				.post(url, query)
				.then((res) => res.body)
				.catch(zuoraClient.catcher);
		},
		update: async (id, unitOfMeasure) => {
			const headers = await zuoraClient.authenticate();
			const url = `${zuoraClient.serverUrl}/v1/object/unit-of-measure/${id}`;
			const query = {
				body: unitOfMeasure,
				headers,
				json: true,
				resolveBodyOnly: true,
			};
			return got
				.put(url, query)
				.then((res) => res.body)
				.catch(zuoraClient.catcher);
		},
		get: (unitOfMeasureId) =>
			zuoraClient.getObject('/v1/object/unit-of-measure/' + unitOfMeasureId),
	};
};
