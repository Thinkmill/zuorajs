const BPromise = require('bluebird');
const got = require('got');
const _ = require('lodash');

const accountsLib = require('./lib/accounts.js');
const actionLib = require('./lib/action.js');
const amendmentLib = require('./lib/amendments.js');
const attachmentsLib = require('./lib/attachments.js');
const billRunLib = require('./lib/billRun.js');
const contactsLib = require('./lib/contacts.js');
const exportsLib = require('./lib/exports.js');
const filesLib = require('./lib/files.js');
const invoicesLib = require('./lib/invoices.js');
const invoiceItemsLib = require('./lib/invoiceItems.js');
const productsLib = require('./lib/products.js');
const productRatePlansLib = require('./lib/productRatePlans.js');
const productRatePlanChargesLib = require('./lib/productRatePlanCharges.js');
const ratePlanChargesLib = require('./lib/ratePlanCharges.js');
const subscriptionsLib = require('./lib/subscriptions.js');
const taxationItemsLib = require('./lib/taxationItems.js');
const unitOfMeasureLib = require('./lib/unitOfMeasure.js');
const paymentMethodsLib = require('./lib/paymentMethods');
const rsaSignaturesLib = require('./lib/rsaSignatures');
const paymentsLib = require('./lib/payments');
const usagesLib = require('./lib/usages.js');

const { catcher } = require('./lib/utils.js');

function Zuora(config) {
	this.serverUrl = config.url;
	this.authMethod = config.authMethod || 'cookie';
	this.apiAccessKeyId = config.apiAccessKeyId;
	this.apiSecretAccessKey = config.apiSecretAccessKey;
	this.clientId = config.clientId;
	this.clientSecret = config.clientSecret;
	this.entityId = config.entityId;
	this.entityName = config.entityName;
	this.debugErrors = config.debugErrors || false;
	this.catcher = this.debugErrors
		? catcher
		: (error) => {
				throw error;
		  };

	this.accounts = accountsLib(this);
	this.action = actionLib(this);
	this.amendments = amendmentLib(this);
	this.attachments = attachmentsLib(this);
	this.billRun = billRunLib(this);
	this.contacts = contactsLib(this);
	this.exports = exportsLib(this);
	this.files = filesLib(this);
	this.invoices = invoicesLib(this);
	this.invoiceItems = invoiceItemsLib(this);
	this.products = productsLib(this);
	this.productRatePlans = productRatePlansLib(this);
	this.productRatePlanCharges = productRatePlanChargesLib(this);
	this.ratePlanCharges = ratePlanChargesLib(this);
	this.subscriptions = subscriptionsLib(this);
	this.taxationItems = taxationItemsLib(this);
	this.unitOfMeasure = unitOfMeasureLib(this);
	this.paymentMethods = paymentMethodsLib(this);
	this.rsaSignatures = rsaSignaturesLib(this);
	this.payments = paymentsLib(this);
	this.usages = usagesLib(this);
}
module.exports = Zuora;

Zuora.prototype.authenticate = function () {
	const oauthV2 = () => {
		if (this.access_token === undefined || Date.now() > this.renewal_time) {
			const url = `${this.serverUrl}/oauth/token`;

			const auth_params = {
				form: true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: {
					client_id: this.clientId,
					client_secret: this.clientSecret,
					grant_type: 'client_credentials',
				},
			};

			return got
				.post(url, auth_params)
				.then((res) => {
					const responseBody = JSON.parse(res.body);

					this.access_token = responseBody.access_token;
					this.renewal_time = Date.now() + responseBody.expires_in * 1000 - 60000;
					return { Authorization: `Bearer ${this.access_token}` };
				})
				.catch(this.catcher);
		} else {
			return BPromise.resolve({ Authorization: `Bearer ${this.access_token}` });
		}
	};

	const cookie = () => {
		if (this.authCookie === undefined) {
			const url = this.serverUrl + '/v1/connections';
			const query = {
				headers: {
					'user-agent': 'zuorajs',
					apiAccessKeyId: this.apiAccessKeyId,
					apiSecretAccessKey: this.apiSecretAccessKey,
				},
				json: true,
			};
			return got
				.post(url, query)
				.then((res) => {
					this.authCookie = res.headers['set-cookie'][0];
					return { cookie: this.authCookie };
				})
				.catch(this.catcher);
		} else {
			return BPromise.resolve({ cookie: this.authCookie });
		}
	};

	if (this.authMethod === 'oauth_v2') {
		return oauthV2();
	} else {
		return cookie();
	}
};

Zuora.prototype.getObject = function (url) {
	return this.authenticate().then((headers) => {
		const fullUrl = this.serverUrl + url;
		const query = {
			headers,
			json: true,
		};
		return got
			.get(fullUrl, query)
			.then((res) => res.body)
			.catch(this.catcher);
	});
};

Zuora.prototype.queryFirst = function (queryString) {
	return this.action
		.query(queryString)
		.then((queryResult) => (queryResult.size > 0 ? queryResult.records[0] : null));
};

Zuora.prototype.queryFull = function (queryString) {
	const fullQueryMore = (queryLocator) =>
		this.action
			.queryMore(queryLocator)
			.then((result) =>
				result.done
					? result.records
					: fullQueryMore(result.queryLocator).then((more) => _.concat(result.records, more))
			);

	return this.action
		.query(queryString)
		.then((result) =>
			result.done
				? result.records
				: fullQueryMore(result.queryLocator).then((more) => _.concat(result.records, more))
		);
};

Zuora.prototype.describe = function (type) {
	const url = this.serverUrl + '/v1/describe/' + type;
	return this.authenticate().then((headers) => {
		const query = {
			headers,
			// json: true,
		};
		return got
			.get(url, query)
			.then((res) => res.body)
			.catch(this.catcher);
	});
};
