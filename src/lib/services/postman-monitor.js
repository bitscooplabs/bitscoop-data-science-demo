'use strict';

const assert = require('assert');

const Sequelize = require('sequelize');
const _ = require('lodash');


class PostmanMonitor {
	constructor(sequelize) {
		this.sequelize = sequelize;

		this.model = this.sequelize.define('postman', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			date: {
				type: Sequelize.DATE
			},
			status: {
				type: Sequelize.BOOLEAN
			}
		}, {
			timestamps: false,
			freezeTableName: true
		});
	}

	fetchData() {
		let bitscoop = global.env.bitscoop;

		try {
			assert(process.env.POSTMAN_MONITOR_ID != null, 'Postman monitor configuration cannot be `null`.');
		} catch(err) {
			return Promise.resolve('Postman is missing some important configuration parameters.');
		}

		let map = bitscoop.map(process.env.POSTMAN_MAP_ID);
		let cursor = map.endpoint('RunMonitor').method('POST');

		return cursor({
			query: {
				monitor_id: process.env.POSTMAN_MONITOR_ID
			}
		});
	}

	insertData(dateNow, result) {
		let self = this;
		let [data, response] = result;

		if (!(/^2/.test(response.statusCode))) {
			let body = JSON.parse(response.body);

			return Promise.reject(new Error('Error calling Postman: ' + body.message));
		}

		let status = _.get(data, 'run.stats.assertions.failed');

		console.log(status);
		return self.model.sync().then(function() {
			return self.model.create({
				date: dateNow,
				status: status
			})
		});
	}
}


module.exports = PostmanMonitor;
