'use strict';

/*
 * Purpose : For User Profile
 * Company : Mobiweb Technology Pvt. Ltd.
 * Developed By  : Sorav Garg
 * Package : UserProfile
 */

var UserProfile = exports;
var async    = require('async');
var appRoot  = require('app-root-path');
var constant = require(appRoot + '/config/constant.js');
var custom   = require(appRoot + '/lib/custom.js');
var database = require(appRoot + '/config/database.js');
var model    = require(appRoot + '/lib/model.js');

/**
 * To get user profile details
 * @param {string} userLoginSessionKey
 */

UserProfile.viewProfile = function(req, res) {
	req.sanitize("userLoginSessionKey").trim();
    req.check('userLoginSessionKey', 'The User login session key field is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        res.send({
            "code": 200,
            "response": {},
            "status": 0,
            "message": custom.manageValidationMessages(errors)
        });
    } else {
		let userLoginSessionKey = req.sanitize('userLoginSessionKey').escape().trim();

		/* To validate user login session key */
		custom.handleLoggedInUser(function(respType,respObj) {
			if(parseInt(respType) === 0){
				res.send(respObj);
				return false;
			}else{
				/* To get user profile response */
				let profileResponse = custom.getUserProfileResponse(respObj);
				res.send({
		            "code": 200,
		            "response": profileResponse,
		            "status": 1,
		            "message": 'success'
		        });
				return false;
			}
		},userLoginSessionKey);
	}
}

/**
 * To update user profile
 * @param {string} userLoginSessionKey
 * @param {string} userFirstName
 * @param {string} userLastName
 * @param {string} userGender
 * @param {string} userDOB
 * @param {string} userCountry
 * @param {string} userCity
 * @param {string} userAddress
 * @param {double} userLatitude
 * @param {double} userLongitude
 */

UserProfile.updateProfile = function(req, res) {
	req.sanitize("userLoginSessionKey").trim();
	req.sanitize("userFirstName").trim();
	req.sanitize("userLastName").trim();
	req.sanitize("userGender").trim();
	req.sanitize("userDOB").trim();
	req.sanitize("userCountry").trim();
	req.sanitize("userCity").trim();
	req.sanitize("userAddress").trim();
	req.sanitize("userLatitude").trim();
	req.sanitize("userLongitude").trim();
    req.check('userLoginSessionKey', 'The User login session key field is required').notEmpty();
    req.check('userFirstName', 'Enter first name').notEmpty();
    req.check('userLastName', 'Enter last name').notEmpty();
    req.check('userGender', 'Select gender').inList(['MALE', 'FEMALE', 'OTHER']);
    req.check('userDOB', 'Select date of birth.').notEmpty();
    req.check('userCountry', 'Enter country name').notEmpty();
    req.check('userCity', 'Enter city name').notEmpty();
    req.check('userAddress', 'Enter address').notEmpty();
    req.check('userLatitude', 'Enter latitude').notEmpty();
    req.check('userLongitude', 'Enter longitude').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        res.send({
            "code": 200,
            "response": {},
            "status": 0,
            "message": custom.manageValidationMessages(errors)
        });
    } else {
		let userLoginSessionKey   = req.sanitize('userLoginSessionKey').escape().trim();
		let userFirstName         = req.sanitize('userFirstName').escape().trim();
		let userLastName          = req.sanitize('userLastName').escape().trim();
		let userGender            = req.sanitize('userGender').escape().trim();
		let userDOB               = req.sanitize('userDOB').escape().trim();
		let userCountry           = req.sanitize('userCountry').escape().trim();
		let userCity              = req.sanitize('userCity').escape().trim();
		let userAddress           = req.sanitize('userAddress').escape().trim();
		let userLatitude          = req.sanitize('userLatitude').escape().trim();
		let userLongitude         = req.sanitize('userLongitude').escape().trim();
		let isValidDate           = custom.validateDateTime(userDOB,'YYYY-MM-DD');

		 /* Validate date of birth format */
        if(!isValidDate){
            return res.send({
                        "code": 200,
                        "response": {},
                        "status": 0,
                        "message": 'Invalid Date of birth format, should be (YYYY-MM-DD)'
                    });
        }

        /* Get age from date of birth */
        let moment     = require('moment');
        let getUserAge = parseInt(moment().diff(userDOB, 'years'));
        if(getUserAge < parseInt(constant.min_age_limit))
        {
            return res.send({
                        "code": 200,
                        "response": {},
                        "status": 0,
                        "message": 'Your age must be '+constant.min_age_limit+' years old.'
                    });
        }

		/* To validate user login session key */
		custom.handleLoggedInUser(function(respType,respObj) {
			if(parseInt(respType) === 0){
				res.send(respObj);
				return false;
			}else{
				/* Update user data */
	            var dataObj = {};
	            dataObj.userFirstName = userFirstName;
	            dataObj.userLastName = userLastName;
	            dataObj.userGender = userGender;
	            dataObj.userDOB = userDOB;
	            dataObj.userCountry = userCountry;
	            dataObj.userCity = userCity;
	            dataObj.userAddress = userAddress;
	            dataObj.userLatitude = userLatitude;
	            dataObj.userLongitude = userLongitude;
	            model.updateData(function(err,resp){
	                if(err){
	                    res.send(custom.dbErrorResponse());
	                    return false;
	                }else{
	                    res.send({
				            "code": 200,
				            "response": {},
				            "status": 1,
				            "message": 'Profile updated successfully.'
				        });
				        return false;
	                }
	            },constant.user_details,dataObj,{userId:respObj[0].userId});
			}
		},userLoginSessionKey);
	}
}

/**
 * To upload user profile & cover images
 * @param {string} userLoginSessionKey
 * @param {file} userFile
 * @param {string} fileUploadType
 */

UserProfile.uploadUserImage = function(req, res) {
	let ejs     = require('ejs');
    let path    = require('path');
    let multer  = require('multer');
    let uploadPath = './uploads/users/';

    /* Set file destination path */
	let storage = multer.diskStorage({
		destination: function(req, file, callback) {
			callback(null, uploadPath)
		},
		filename: function(req, file, callback) {
			let uploadedFileName = 'user-'+ Date.now() + '-' + custom.getGuid() + path.extname(file.originalname);
			callback(null, uploadedFileName)
		}
	});

	var upload = multer({
						storage: storage,
						fileFilter: function(req, file, callback) {
							let ext = path.extname(file.originalname)
							if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
						        req.fileValidationError = 'goes wrong on the mimetype';
						        return callback(null, false, new Error('goes wrong on the mimetype'))
							}else{
								callback(null, true)
							}
						}
				}).single('userFile');
	
	/* Upload file */
    upload(req, res, function(err) {
    	if(req.fileValidationError) {
            return  res.send({
				            "code": 200,
				            "response": {},
				            "status": 0,
				            "message": 'You can upload only png, jpg, gif & jpeg files.'
				        });
        }else{
        	let uploadedFileName = req.file.filename;
        	let uploadedFilePath = req.file.path;
        	req.sanitize("userLoginSessionKey").trim();
			req.sanitize("fileUploadType").trim();
		    req.check('userLoginSessionKey', 'The User login session key field is required').notEmpty();
		    req.check('fileUploadType', 'Required File Upload Type').inList(['PROFILE_IMG', 'COVER_IMG']);
		    let errors = req.validationErrors();
		    if (errors) {
		    	
		    	/* To delete uploaded file */
		    	custom.unlinkFile(uploadedFilePath);
		        res.send({
		            "code": 200,
		            "response": {},
		            "status": 0,
		            "message": custom.manageValidationMessages(errors)
		        });
		    } else {
				let userLoginSessionKey   = req.sanitize('userLoginSessionKey').escape().trim();
				let fileUploadType        = req.sanitize('fileUploadType').escape().trim();
				if(fileUploadType === 'PROFILE_IMG'){
					var thumbailWidth = 150;
				}else{
					var thumbailWidth = 400;
				}

				async.waterfall([
				    function(callback) {
				    	/* To validate user login session key */
						custom.handleLoggedInUser(function(respType,respObj) {
							if(parseInt(respType) === 0){
								/* To delete uploaded file */
				                custom.unlinkFile(uploadedFilePath);
								res.send(respObj);
								return false;
							}else{
								callback(null, respObj);
							}
						},userLoginSessionKey);
				    },
				    function(userDetailsObj, callback) {

				        /* Generate uploaded image thumbnail */
						custom.getImgThumbnail(function(respType,resp){
							if(parseInt(respType) === 0){
				                /* To delete uploaded file */
				                custom.unlinkFile(uploadedFilePath);
				                return res.send(resp);
							}else{
								let thumbnailUploadedImgPath = resp;
								callback(null, userDetailsObj,thumbnailUploadedImgPath);
							}
						},uploadedFilePath,uploadPath,thumbailWidth);
				    }
				], function (err,userDetailsObj,thumbnailUploadedImgPath) {
				    
				    var updateDataObj = {};
				    if(fileUploadType === 'PROFILE_IMG'){
						updateDataObj.userImage = uploadedFilePath;
						updateDataObj.userImageThumbnail = thumbnailUploadedImgPath;
						updateDataObj.userProfileImageStatus = 1;
					}else{
						updateDataObj.userCoverImage = uploadedFilePath;
						updateDataObj.userCoverImageThumbnail = thumbnailUploadedImgPath;
						updateDataObj.userCoverImageStatus = 1;
					}
					model.updateData(function(err,resp){
	                    if(err){
	                    	/* To delete uploaded files */
				            custom.unlinkFile(uploadedFilePath);
				            custom.unlinkFile(thumbnailUploadedImgPath);
	                        return res.send(custom.dbErrorResponse());
	                    }else{
	                    	var successResp   = {};
	                    	if(fileUploadType === 'PROFILE_IMG'){
	                    		/* To delete old images */
	                    		if(userDetailsObj[0].userImage) custom.unlinkFile(userDetailsObj[0].userImage);
	                    		if(userDetailsObj[0].userImageThumbnail) custom.unlinkFile(userDetailsObj[0].userImageThumbnail);
	                    		var successMsg = 'Profile image uploaded scuccessfully.';
								successResp.userImage = constant.base_url + uploadedFilePath;
								successResp.userImageThumbnail = constant.base_url + thumbnailUploadedImgPath;
	                    	}else{
	                    		/* To delete old images */
	                    		if(userDetailsObj[0].userCoverImage) custom.unlinkFile(userDetailsObj[0].userCoverImage);
	                    		if(userDetailsObj[0].userCoverImageThumbnail) custom.unlinkFile(userDetailsObj[0].userCoverImageThumbnail);
								var successMsg = 'Cover image uploaded scuccessfully.';
								successResp.userCoverImage = constant.base_url + uploadedFilePath;
								successResp.userCoverImageThumbnail = constant.base_url + thumbnailUploadedImgPath;
	                    	}
	                        return  res.send({
							            "code": 200,
							            "response": successResp,
							            "status": 1,
							            "message":successMsg 
							        });
	                    }
	                },constant.user_details,updateDataObj,{userId:userDetailsObj[0].userId});
				});
			}
        }
    });
}
/**
 * To change user password
 * @param {string} userLoginSessionKey
 * @param {string} oldPassword
 * @param {string} newPassword
 * @param {string} confirmPassword
 */

UserProfile.changePassword = function(req, res) {

	let locale = req.headers.locale;
	req.sanitize("userLoginSessionKey").trim();
	req.sanitize("oldPassword").trim();
	req.sanitize("newPassword").trim();
	req.sanitize("confirmPassword").trim();
    req.check('userLoginSessionKey', 'The User login session key field is required').notEmpty();
    req.check('oldPassword', custom.lang(locale,'Enter old password')).notEmpty();
    req.check('newPassword', custom.lang(locale,'Enter new password')).notEmpty();
    req.check('confirmPassword', custom.lang(locale,'Enter confirm password')).notEmpty();
    req.check('newPassword', custom.lang(locale,'The New Password field must contain at least 6 characters, including UPPER/lower case & numbers & at-least a special character')).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/, "i");
    req.check('confirmPassword', custom.lang(locale,'The Confirm Password field must contain at least 6 characters, including UPPER/lower case & numbers & at-least a special character')).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/, "i");
    req.check('confirmPassword', custom.lang(locale,'The Confirm Password field does not match the new password field')).equals(req.body.newPassword);
    let errors = req.validationErrors();
    if (errors) {
        res.send({
            "code": 200,
            "response": {},
            "status": 0,
            "message": custom.manageValidationMessages(errors)
        });
    } else {
		let userLoginSessionKey = req.sanitize('userLoginSessionKey').escape().trim();
		let oldPassword         = custom.getMd5Value(req.sanitize('oldPassword').escape().trim());
		let newPassword         = custom.getMd5Value(req.sanitize('newPassword').escape().trim());
		let confirmPassword     = custom.getMd5Value(req.sanitize('confirmPassword').escape().trim());

		/* To validate user login session key */
		custom.handleLoggedInUser(function(respType,respObj) {
			if(parseInt(respType) === 0){
				return res.send(respObj);
			}else{
				if(parseInt(respObj[0].isSocialSignup) === 1){
					return res.send({
					            "code": 200,
					            "response": {},
					            "status": 0,
					            "message": custom.lang(locale,'Social user can`t change password.')
					        });
				}else if(parseInt(respObj[0].isSocialSignup) === 0 && respObj[0].userPassword !== oldPassword){
					return res.send({
					            "code": 200,
					            "response": {},
					            "status": 0,
					            "message": custom.lang(locale,'Old password doesn`t match.')
					        });
				}else if(newPassword === oldPassword){
					return res.send({
					            "code": 200,
					            "response": {},
					            "status": 0,
					            "message": custom.lang(locale,'New password should be different to current password.')
					        });
				}else{
					let userId = parseInt(respObj[0].masterUserId);
					let newLoginSessionKey = custom.getGuid();

					/* Update user password */
                    database.pool.getConnection(function(err, connection) {

                        /* Begin transaction */
                        connection.beginTransaction(function(err) {
                            if (err) {
                                return res.send(custom.dbErrorResponse());
                            }

                        let userQuery = queryBuilder.update(constant.users,{userPassword:newPassword},{masterUserId:userId});
                        queryBuilder.reset_query(userQuery);
                        connection.query(userQuery, function(err, result) {
                        if (err) {
                            connection.rollback(function() {
                                return res.send(custom.dbErrorResponse(err.sqlMessage));
                            });
                        }

                        let userDetailsQuery = queryBuilder.update(constant.user_details,{userLoginSessionKey:newLoginSessionKey},{userId:userId});
                        queryBuilder.reset_query(userDetailsQuery);
                        connection.query(userDetailsQuery, function(err, result) {
                        if (err) {
                            connection.rollback(function() {
                                return res.send(custom.dbErrorResponse(err.sqlMessage));
                            });
                        }

                        connection.commit(function(err) {
	                        if (err) {
	                            connection.rollback(function() {
	                                return res.send(custom.dbErrorResponse());
	                            });
	                        }else{
	                            connection.release();

	                            /* Return user response */
	                            let user_response = {newLoginSessionKey:newLoginSessionKey};
	                            res.send({"code" : 200, "response" : user_response,"status" : 1,"message" : custom.lang(locale,'Your password changed successfully.')});
	                            return;
	                        }
	                    });
	                    });
	                    });
	                    });
	                });
				}			
			}
		},userLoginSessionKey);
	}
}
