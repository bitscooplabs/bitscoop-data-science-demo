'use strict';

const assert = require('assert');

const BitScoop = require('bitscoop-sdk');
const moment = require('moment');
const Sequelize = require('sequelize');

const services = require('./lib/services');


global.env = {
	name: 'BitScoop',
	bitscoop: new BitScoop(process.env.BITSCOOP_API_KEY)
};

let GithubIssues = services.GithubIssues;
let GoogleAnalytics = services.GoogleAnalytics;
let PostmanMonitor = services.PostmanMonitor;
let StatuscakeAlerts = services.StatuscakeAlerts;


exports.handler = function() {
	let dateNow = moment().utc().format('YYYY-MM-DD');
	let sequelize;

	return Promise.resolve()
		.then(function() {
			try {
				assert(process.env.BITSCOOP_API_KEY != null, 'Unspecified BitScoop API key.');
				assert(process.env.HOST != null, 'Unspecified RDS host.');
				assert(process.env.PORT != null, 'Unspecified RDS port.');
				assert(process.env.USER != null, 'Unspecified RDS user.');
				assert(process.env.PASSWORD != null, 'Unspecified RDS password.');
				assert(process.env.DATABASE != null, 'Unspecified RDS database.');
			} catch(err) {
				return Promise.reject(err);
			}

			sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
				host: process.env.HOST,
				port: process.env.PORT,
				dialect: 'mysql'
			});

			return Promise.resolve();
		})
		.then(function() {
			let promises = [];

			if (process.env.GOOGLE_MAP_ID) {
				let googleAnalytics = new GoogleAnalytics(sequelize);

				promises.push(
					googleAnalytics.fetchData()
						.then(function(result) {
							return googleAnalytics.insertData(dateNow, result)
						})
				);
			}

			if (process.env.STATUSCAKE_MAP_ID) {
				let statuscake = new StatuscakeAlerts(sequelize);

				promises.push(
					statuscake.fetchData()
						.then(function(result) {
							return statuscake.insertData(dateNow, result)
						})
				);
			}

			if (process.env.POSTMAN_MAP_ID) {
				let postman = new PostmanMonitor(sequelize);

				promises.push(
					postman.fetchData()
						.then(function(result) {
							return postman.insertData(dateNow, result)
						})
				);
			}

			if (process.env.GITHUB_MAP_ID) {
				let github = new GithubIssues(sequelize);

				promises.push(
					github.fetchData()
						.then(function(result) {
							return github.insertData(dateNow, result)
						})
				);
			}

			if (promises.length === 0) {
				return Promise.resolve(new Error('You haven\'t configured any status checks'));
			}

			return Promise.all(promises);
		})
		.then(function() {
			console.log('SUCCESSFUL');
			sequelize.close();

			return Promise.resolve();
		})
		.catch(function(err) {
			console.log('UNSUCCESSFUL');
			sequelize.close();

			return Promise.reject(err);
		});
};
