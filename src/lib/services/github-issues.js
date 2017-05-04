'use strict';

const assert = require('assert');

const Sequelize = require('sequelize');


class GithubIssues {
	constructor(sequelize) {
		this.sequelize = sequelize;

		this.model = this.sequelize.define('github', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			date: {
				type: Sequelize.DATE
			},
			issues: {
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
			assert(process.env.GITHUB_USER != null, 'GitHub user configuration cannot be `null`.');
		} catch(err) {
			return Promise.resolve('GitHub is missing some important configuration parameters.');
		}

		try {
			assert(process.env.GITHUB_REPO != null, 'GitHub repository configuration cannot be `null`.');
		} catch(err) {
			return Promise.resolve('GitHub is missing some important configuration parameters.');
		}

		let map = bitscoop.map(process.env.GITHUB_MAP_ID);
		let cursor = map.endpoint('Issues').method('GET');

		return cursor({
			query: {
				user: process.env.GITHUB_USER,
				repo: process.env.GITHUB_REPO
			}
		});
	}

	insertData(dateNow, result) {
		let self = this;
		let [data, response] = result;

		if (!(/^2/.test(response.statusCode))) {
			let body = JSON.parse(response.body);

			return Promise.reject(new Error('Error calling GitHub: ' + body.message));
		}

		let issues = data.length;

		return self.model.sync().then(function() {
			return self.model.create({
				date: dateNow,
				issues: issues
			})
		});
	}
}


module.exports = GithubIssues;
