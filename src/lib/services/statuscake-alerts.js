'use strict';

const assert = require('assert');

const Sequelize = require('sequelize');
const moment = require('moment');


class StatuscakeAlerts {
	constructor(sequelize) {
		this.sequelize = sequelize;

		this.model = this.sequelize.define('statuscake', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			date: {
				type: Sequelize.DATE
			},
			outages: {
				type: Sequelize.INTEGER
			}
		}, {
			timestamps: false,
			freezeTableName: true
		});
	}

	fetchData() {
		let bitscoop = global.env.bitscoop;

		try {
			assert(process.env.STATUSCAKE_TEST_ID != null, 'StatusCake test configuration cannot be `null`.');
		} catch(err) {
			return Promise.resolve('StatusCake is missing some important configuration parameters.');
		}

		let map = bitscoop.map(process.env.STATUSCAKE_MAP_ID);
		let cursor = map.endpoint('Alerts').method('GET');

		return cursor({
			query: {
				test_id: process.env.STATUSCAKE_TEST_ID,
				since: moment().utc().subtract(1, 'day').unix()
			}
		});
	}

	insertData(dateNow, result) {
		let self = this;
		let [data, response] = result;

		if (!(/^2/.test(response.statusCode))) {
			let body = JSON.parse(response.body);

			return Promise.reject(new Error('Error calling Statuscake: ' + body.message));
		}

		let outages = data.length;

		return self.model.sync().then(function() {
			return self.model.create({
				date: dateNow,
				outages: outages
			})
		});
	}
}


module.exports = StatuscakeAlerts;
