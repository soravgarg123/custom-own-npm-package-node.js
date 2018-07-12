"use strict";

/*
 * Purpose: For database connection 
 * Authur : Sorav Garg
 * Company: Mobiweb Technology Pvt. Ltd.
*/

var mysql    = require('mysql'),
	appRoot  = require('app-root-path'),
	settings = require(appRoot + '/db.json'),	
	appConst = require(appRoot + '/config/constant.js');

class Database {

	/* Constructor To Define Database Connection */
	constructor() {
		this.MsgDb = null;
		this.pool  = mysql.createPool(settings);
	}

	/**
	 * To fire mysql queries
	 * @param {string} query
	*/
	getConn(query, callBack) {
		this.pool.getConnection(function (err, connection) {
			connection.query(query, function (err, rows) {
				connection.release();
				return callBack(err, rows);
			});
		});
	}

}

module.exports = new Database();

/* End of file database.js */
/* Location: ./config/database.js */