"use strict";

/*
 * Purpose: Database query builder
 * Authur : Sorav Garg
 * Company: Mobiweb Technology Pvt. Ltd.
*/

var appRoot  = require('app-root-path'),
	custom   = require(appRoot + '/lib/custom.js'),
	settings = require(appRoot + '/db.json'),
	appConst = require(appRoot + '/config/constant.js'),
    qb = require('node-querybuilder').QueryBuilder(settings, 'mysql', 'single');

class Model {

	constructor() 
	{
		this.limit = 10;
		this.order_type = 'DESC';
	}

	/**
	 * To insert data into table
	 * @param {string} table
	 * @param {object} dataObj
	*/
    insertData(callBack,table,dataObj)
    {
    	qb.insert(table, dataObj, (err, res) => {
		    if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
		});
    }

    /**
	 * To insert bulk data into table
	 * @param {string} table
	 * @param {object} dataObj
	*/
    insertBulkData(callBack,table,dataObj)
    {
    	qb.insert_batch(table, dataObj, (err, res) => {
		    if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
		});
    }

    /**
	 * To update data into table
	 * @param {string} table
	 * @param {object} dataObj
	 * @param {object} whereObj
	*/
    updateData(callBack,table,dataObj,whereObj)
    {
    	qb.update(table, dataObj, whereObj , (err, res) => {
		    if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
		});
    }

    /**
	 * To delete data from table
	 * @param {string} table
	 * @param {object} whereObj
	*/
    deleteData(callBack,table,whereObj)
    {
    	qb.delete(table, whereObj , (err, res) => {
		    if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
		});
    }

    /**
	 * To fire custom query
	 * @param {string} query
	*/
    customQuery(callBack,query)
    {
    	qb.query(query , (err, res) => {
		    if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
		});
    }

    /**
	 * To get whole table data
	 * @param {string} table
	 * @param {string} orderField
	 * @param {string} orderType
	 * @param {string} fields
	 * @param {integer} limit
	 * @param {integer} offset
	 * @param {string} groupBy
	*/
    getAll(callBack,table,orderField,orderType,fields,limit,offset,groupBy)
    {
    	if(fields){
    		qb.select(fields);
    	}else{
    		qb.select('*');
    	}
    	if(orderField && orderType){
    		qb.order_by(orderField, orderType);
    	}
    	if(limit && limit > 0){
    		qb.limit(limit);
    	}
    	if(offset && offset > 0){
    		qb.offset(offset);
    	}
    	if(groupBy){
    		qb.group_by(groupBy);
    	}
    	qb.get(table, (err,res) => {
    		if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
	    });
    }

    /**
	 * To get conditional data
	 * @param {string} table
	 * @param {object} whereObj
	 * @param {string} orderField
	 * @param {string} orderType
	 * @param {string} fields
	 * @param {integer} limit
	 * @param {integer} offset
	 * @param {string} groupBy
	*/
    getAllWhere(callBack,table,whereObj,orderField,orderType,fields,limit,offset,groupBy)
    {
    	if(fields){
    		qb.select(fields);
    	}else{
    		qb.select('*');
    	}
    	if(whereObj){
    		qb.where(whereObj);
    	}
    	if(orderField && orderType){
    		qb.order_by(orderField, orderType);
    	}
    	if(limit && limit > 0){
    		qb.limit(limit);
    	}
    	if(offset && offset > 0){
    		qb.offset(offset);
    	}
    	if(groupBy){
    		qb.group_by(groupBy);
    	}
    	qb.get(table, (err,res) => {
    		if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
	    });
    }

    /**
	 * To get count of total rows
	 * @param {string} table
	 * @param {object} whereObj
	 * @param {string} groupBy
	*/
    getCount(callBack,table,whereObj,groupBy)
    {
    	if(whereObj){
    		qb.where(whereObj);
    	}
    	if(groupBy){
    		qb.group_by(groupBy);
    	}
    	qb.count(table, (err,res) => {
    		if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
	    });
    }

    /**
	 * To get min, max, average, sum of results
	 * @param {string} table
	 * @param {string} fieldName
	 * @param {string} type
	 * @param {object} whereObj
	 * @param {string} groupBy
	*/
    getMinMaxAvgsum(callBack,table,fieldName,type,whereObj,groupBy)
    {
    	switch(type) {
		    case "MIN":
		        qb.select_min(fieldName, 'result')
		        break;
		    case "MAX":
		        qb.select_max(fieldName, 'result')
		        break;
		    case "AVG":
		        qb.select_avg(fieldName, 'result')
		        break;
		    case "SUM":
		        qb.select_sum(fieldName, 'result')
		        break;
		    default:
		}
    	if(whereObj){
    		qb.where(whereObj);
    	}
    	if(groupBy){
    		qb.group_by(groupBy);
    	}
    	qb.get(table, (err,res) => {
    		if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
	    });
    }

    /**
	 * To get conditional data
	 * @param {string} table1
	 * @param {string} table2
	 * @param {string} condition1
	 * @param {string} condition2
	 * @param {string} joinType
	 * @param {object} whereObj
	 * @param {string} orderField
	 * @param {string} orderType
	 * @param {string} fields
	 * @param {integer} limit
	 * @param {integer} offset
	 * @param {string} groupBy
	*/
    getSingleJoinData(callBack,table1,table2,condition1,condition2,joinType,whereObj,orderField,orderType,fields,limit,offset,groupBy)
    {
    	if(fields){
    		qb.select(fields);
    	}else{
    		qb.select('*');
    	}
    	qb.from(table1);
    	qb.join(table2, table1 + '.'+condition1+'='+table2+'.'+condition2, joinType)
    	if(whereObj){
    		qb.where(whereObj);
    	}
    	if(orderField && orderType){
    		qb.order_by(orderField, orderType);
    	}
    	if(limit && limit > 0){
    		qb.limit(limit);
    	}
    	if(offset && offset > 0){
    		qb.offset(offset);
    	}
    	if(groupBy){
    		qb.group_by(groupBy);
    	}
    	qb.get((err,res) => {
    		if (err){
		    	console.log(qb.last_query());
                return callBack(err, res);
		    }else{
		    	return callBack(err, res);
		    }
	    });
    }

}

module.exports = new Model();

/* End of file model.js */
/* Location: ./lib/model.js */