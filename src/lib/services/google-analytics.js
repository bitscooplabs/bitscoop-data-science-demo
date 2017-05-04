'use strict';

const assert = require('assert');

const Sequelize = require('sequelize');
const _ = require('lodash');


class GoogleAnalytics {
	constructor(sequelize) {
		this.sequelize = sequelize;

		this.model = this.sequelize.define('google_analytics', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			date: {
				type: Sequelize.DATE
			},
			totalUsers: {
				type: Sequelize.INTEGER,
				field: 'total_users'
			},
			newUsers: {
				type: Sequelize.INTEGER,
				field: 'new_users'
			}
		}, {
			timestamps: false,
			freezeTableName: true
		});
	}

	fetchData() {
		let bitscoop = global.env.bitscoop;

		try {
			assert(process.env.GOOGLE_GA_VIEW_ID != null, 'Google Analytics view configuration cannot be `null`.');
		} catch(err) {
			return Promise.resolve('Google is missing some important configuration parameters.');
		}

		try {
			assert(process.env.GOOGLE_CONNECTION_ID != null, 'Google Analytics connection ID cannot be `null`.');
		} catch(err) {
			return Promise.resolve('Google is missing some important configuration parameters.');
		}

		let map = bitscoop.map(process.env.GOOGLE_MAP_ID);
		let cursor = map.endpoint('Metrics').method('GET');

		return cursor({
			headers: {
				'X-Connection-Id': process.env.GOOGLE_CONNECTION_ID
			},
			query: {
				view_id: process.env.GOOGLE_GA_VIEW_ID
			}
		});
	}

	insertData(dateNow, result) {
		let self = this;
		let [data, response] = result;

		if (!(/^2/.test(response.statusCode))) {
			let body = JSON.parse(response.body);

			return Promise.reject(new Error('Error calling Google Analytics: ' + body.message));
		}

		let totalUsers = parseInt(_.get(data, 'totalsForAllResults[\'ga:users\']'));
		let newUsers = parseInt(_.get(data, 'totalsForAllResults[\'ga:newUsers\']'));

		return self.model.sync().then(function() {
			return self.model.create({
				date: dateNow,
				total_users: totalUsers,
				new_users: newUsers
			})
		});
	}
}


module.exports = GoogleAnalytics;
