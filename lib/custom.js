"use strict";

/*
 * Purpose: For manage custom functions
 * Authur : Sorav Garg
 * Company: Mobiweb Technology Pvt. Ltd.
*/

var appRoot  = require('app-root-path');
var moment   = require('moment');
var model    = require(appRoot + '/lib/model.js');
var appConst = require(appRoot + '/config/constant.js');

class Custom {

	/* Custom Functions Constructor */
	constructor() {
	}

    /**
     * To generte unique number
     * @param {string} n
    */
    generateRandomNo(n) {
        let low  = 100000;
        let high = 999999;
        var finalNumber = Math.floor(Math.random() * (high - low + 1) + low);
        if(parseInt(finalNumber.length) < parseInt(n)){
            var finalNumber = this.generateRandomNo(n);
        }
        return finalNumber;
    }

    /**
     * To get current time
    */
    getCurrentTime(){
        var dateTime = require('date-time');
        return dateTime({local: false,date: new Date()});
    }

	/**
	 * To manage validation messages
	 * @param {object} reqData
	*/
    manageValidationMessages(reqData){

    	/* Count object length */
    	var count = Object.keys(reqData).length;
    	if(count > 0){
    		for (var i = 0; i < count; i++) {
    			if(reqData[i]['msg'] != ''){
    				return reqData[i]['msg'];
    			}
    		}
    	}else{
    		return '';
    	}
    }

    /**
     * To get md5 value
     * @param {string} value
    */
    getMd5Value(value){
        var md5    = require('md5');
        var crypto = require('crypto');
        return crypto.createHash('md5').update(value).digest("hex");
    }

    /**
     * To get image extension from base64 image
     * @param {string} value
    */
    getImgExtension(value){
        var extension  = '';
        var base64_arr = value.split(';');
        if(base64_arr != '' && base64_arr[0] != ''){
            var first_segment = base64_arr[0];
            var first_segment_arr = first_segment.split('/');
            if(first_segment_arr != '' && first_segment_arr[1] != '')
            {
                return first_segment_arr[1].toLowerCase();
            }
        }
        return extension;
    }

    /**
     * To get unique Id
    */
    getUniqueId(){
        var uniqid = require('uniqid');
        return uniqid.time('QL');
    }

    /**
     * To get offset
     * @param {integer} pageNo 
     * @param {integer} limit 
    */
    getOffset(pageNo,limit = 10){
        if(parseInt(pageNo) === 0){
            pageNo = 1;
        }
        let offsetVal = (parseInt(pageNo) - 1) * parseInt(limit);
        return parseInt(offsetVal);
    }

    /**
     * To change date time format
     * @param {string} datetime 
     * @param {string} format 
    */
    changeDateFormat(datetime,format = 'yyyy-mm-dd hh:MM:ss'){
       if(datetime){
        let dateFormat = require('dateformat');
        return dateFormat(datetime, format);
       }else{
        return '';
       }
    }

    /**
     * To get unique alpha numeric string
    */
    s4(){
        return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
    }

    /**
     * To get unique guid
    */
    getGuid(){
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    /**
     * To handle null or undefined value
     * @param {string} value
     * @param {string} defaultValue
    */
    nullChecker(value,defaultValue = "")
    {
        if(!value){
          return defaultValue;
        }else{
         return value;
        }
    }

    /**
     * To get user ip address
    */
    getUserIp(name = 'public'){
        var ip = require('ip');
        return ip.address(name);
    }

    /**
     * To send mails
     * @param {string} to_email
     * @param {string} subject
     * @param {string} message
    */
    sendEmailCallBack(reqData,callBack){
        let nodemailer = require('nodemailer');
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: appConst.smtp_username,
                pass: appConst.smtp_password
            }
        });
        transporter.sendMail({
            from    : appConst.from_email,
            to      : reqData.to_email,
            subject : reqData.subject,
            html    : reqData.message
        }, function (error, response) {
            if (error) {
                console.log('Mail failed',error);
                return callBack(error, response);
            } else {
                console.log('Mail sent');
                return callBack(error, response);
            }
        });
    }

    /**
     * To send mails
     * @param {string} to_email
     * @param {string} subject
     * @param {string} message
    */
    sendEmail(reqData){
        let nodemailer = require('nodemailer');
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: appConst.smtp_username,
                pass: appConst.smtp_password
            }
        });
        transporter.sendMail({
            from    : appConst.from_email,
            to      : reqData.to_email,
            subject : reqData.subject,
            html    : reqData.message
        }, function (error, response) {
            if (error) {
                console.log('Mail failed',error);
                return false;
            } else {
                console.log('Mail sent');
                return true;
            }
        });
    }

    /**
     * To get database error response
    */
    dbErrorResponse(message){
        let dbErrorResponse = {};
        dbErrorResponse.code = 200; 
        dbErrorResponse.response = {}; 
        dbErrorResponse.status = 0; 
        if(message){
            dbErrorResponse.message = message;
        }else{
            dbErrorResponse.message = 'Database error occured.'; 
        }
        return dbErrorResponse;
    }

    /**
     * To get mail error response
    */
    mailErrorResponse(message){
        let mailErrorResponse = {};
        mailErrorResponse.code = 200; 
        mailErrorResponse.response = {}; 
        mailErrorResponse.status = 0; 
        if(message){
            mailErrorResponse.message = message;
        }else{
            mailErrorResponse.message = 'Failed to send a mail.'; 
        }
        return mailErrorResponse;
    }

    /**
     * For User verification mail message
     * @param {string} userFirstName
     * @param {integer} getTempCode
    */
    verificationMailMsg(userFirstName,getTempCode){
        let siteName = appConst.site_name;
        let verficationMessage = '';
        verficationMessage += 'Hello '+userFirstName+', <br/><br/>';
        verficationMessage += 'Your '+siteName+' profile has been created, Please use below code to verify your '+siteName+' account. <br/><br/>';
        verficationMessage += '<strong>Verification code: </strong>' + getTempCode + '<br/><br/>';
        verficationMessage += 'Thanks <br/> '+siteName+' Team';
        return verficationMessage;
    }

    /**
     * For User forgot password mail message
     * @param {string} userFirstName
     * @param {integer} getTempCode
    */
    forgotPasswordMsg(userFirstName,getTempCode){
        let siteName = appConst.site_name;
        let forgotPasswordMsg = '';
        forgotPasswordMsg += 'Hello '+userFirstName+', <br/><br/>';
        forgotPasswordMsg += 'Somebody (hopefully you) requested a new password for the '+ siteName + ' account. No changes have been made to your account yet.<br/><br/>';
        forgotPasswordMsg += 'Please use below temporary code to reset your password.<br/><br/>';
        forgotPasswordMsg += '<strong>Verification code: </strong>' + getTempCode + '<br/><br/>';
        forgotPasswordMsg += '<strong>Note: </strong>This temporary code will be valid for next '+appConst.code_valid_time+' minutes. <br/><br/>';
        forgotPasswordMsg += 'Thanks <br/> '+siteName+' Team';
        return forgotPasswordMsg;
    }

    /**
     * For get datetime difference 
     * @param {datetime} startDateTime
     * @param {datetime} endDateTime
     * @param {string} diffType
    */
    getDateTimeDifference(startDateTime,endDateTime,diffType){
        let startDate = moment(startDateTime, 'YYYY-M-DD HH:mm:ss')
        let endDate   = moment(endDateTime, 'YYYY-M-DD HH:mm:ss')
        let timeDiff  = endDate.diff(startDate, diffType);
        return parseInt(timeDiff);
    }

    /**
     * To validate date time format
     * @param {datetime} dateTime
     * @param {string} requiredFormat
    */
    validateDateTime(dateTime,requiredFormat){
        let isValid = moment(dateTime,requiredFormat).isValid();
        return isValid;
    }

    /**
     * To handle loggedin user
     * @param {string} userLoginSessionKey
    */
    handleLoggedInUser(callBack,userLoginSessionKey){
        let self = this;
        
        /* Get user details */
        let myQuery = "SELECT * FROM `users` INNER JOIN `user_details` ON `users`.`masterUserId`=`user_details`.`userId` WHERE `user_details`.`userLoginSessionKey` = '"+userLoginSessionKey+"' ";
        model.customQuery(function(err,results){
            if(err){
                return callBack(0,self.dbErrorResponse());
            }else{
                if(results != ""){
                    let lastActivity = self.nullChecker(results[0].userLastActivityDateTime);
                    if(parseInt(results[0].userEmailVerified) === 0){
                        let jsonResp = {"code" : 405, "response" : {},"status" : 0,"message" : appConst.email_verify};
                        return callBack(0,jsonResp);
                    }else if(parseInt(results[0].isUserBlocked) === 1){
                        let jsonResp = {"code" : 405, "response" : {},"status" : 0,"message" : appConst.user_blocked};
                        return callBack(0,jsonResp);
                    }else if(parseInt(results[0].isUserDeactivated) === 1){
                        let jsonResp = {"code" : 405, "response" : {},"status" : 0,"message" : appConst.user_deactivated};
                        return callBack(0,jsonResp);
                    }else if(lastActivity){
                        let moment       = require('moment');
                        let totalDiff    = parseInt(moment().diff(lastActivity, 'hours'));
                        let mainUserId   = parseInt(results[0].userId);
                        if(totalDiff > parseInt(appConst.session_limit)){

                            /* Update user login session key */
                            let userLoginSessionKeyNew = self.getGuid() + mainUserId;
                            model.updateData(function(err,resp){
                                if(err){
                                    return callBack(0,self.dbErrorResponse());
                                }else{
                                    /* Delete user device history */
                                    model.deleteData(function(err,resp){
                                        if(err){
                                            return callBack(0,self.dbErrorResponse());
                                        }else{
                                            let jsonResp = {"code" : 405, "response" : {},"status" : 0,"message" : appConst.session_expired};
                                            return callBack(0,jsonResp);
                                        }
                                    },appConst.users_device_history,{userId:mainUserId});
                                }
                            },appConst.user_details,{userLoginSessionKey:userLoginSessionKeyNew,userLastActivityDateTime:null},{userId:mainUserId});
                        }else{
                            /* Update user last activity */
                            model.updateData(function(err,resp){
                                if(err){
                                    return callBack(0,self.dbErrorResponse());
                                }else{
                                    return callBack(1,results); 
                                }
                            },appConst.user_details,{userLastActivityDateTime:self.getCurrentTime()},{userId:mainUserId});
                        }
                    }
                    else{
                        /* Update user last activity */
                        model.updateData(function(err,resp){
                            if(err){
                                return callBack(0,self.dbErrorResponse());
                            }else{
                                return callBack(1,results); 
                            }
                        },appConst.user_details,{userLastActivityDateTime:self.getCurrentTime()},{userId:results[0].userId});
                    }
                }else{
                    let jsonResp = {"code" : 405, "response" : {},"status" : 0,"message" : appConst.invalid_login_session_key};
                    return callBack(0,jsonResp);
                }
            }
        },myQuery);
    }

    /**
     * To get user profile response
    */
    getUserProfileResponse(respObj){
        var profileResp = {};
        if(respObj)
        {
            profileResp.userId = parseInt(respObj[0].userId);
            profileResp.masterUserId = parseInt(respObj[0].userId);
            profileResp.userFirstName = this.nullChecker(respObj[0].userFirstName);
            profileResp.userEmail = this.nullChecker(respObj[0].userEmail);
            profileResp.userLastName = this.nullChecker(respObj[0].userLastName);
            profileResp.userLoginSessionKey = this.nullChecker(respObj[0].userLoginSessionKey);
            profileResp.userAddress = this.nullChecker(respObj[0].userAddress);
            profileResp.userCountry = this.nullChecker(respObj[0].userCountry);
            profileResp.userCity = this.nullChecker(respObj[0].userCity);
            profileResp.userDOB = this.changeDateFormat(respObj[0].userDOB,'yyyy-mm-dd');
            profileResp.userLatitude = this.nullChecker(respObj[0].userLatitude);
            profileResp.userLongitude = this.nullChecker(respObj[0].userLongitude);
            profileResp.userAge = this.nullChecker(respObj[0].userAge);
            profileResp.userGender = this.nullChecker(respObj[0].userGender);
            profileResp.isSocialSignup = parseInt(respObj[0].isSocialSignup);
            profileResp.userSocialType = this.nullChecker(respObj[0].userSocialType);
            profileResp.isFacebookVerified = parseInt(respObj[0].isFacebookVerified);
            profileResp.isTwitterVerified = parseInt(respObj[0].isTwitterVerified);
            profileResp.isInstagramVerified = parseInt(respObj[0].isInstagramVerified);
            profileResp.noOfVerifiedSocialAccounts = parseInt(respObj[0].noOfVerifiedSocialAccounts);
            profileResp.userBadges = parseInt(respObj[0].userBadges);
            profileResp.userRegistrationDate = this.changeDateFormat(respObj[0].userRegistrationDate);
            profileResp.userLastLogin = this.changeDateFormat(respObj[0].userLastLogin);
            profileResp.userLastIpAddress = this.nullChecker(respObj[0].userLastIpAddress);
            profileResp.userLastActivityDateTime = this.changeDateFormat(respObj[0].userLastActivityDateTime);
            profileResp.userImage = "";
            profileResp.userImageThumbnail = "";
            profileResp.userCoverImage = "";
            profileResp.userCoverImageThumbnail = "";
            if(respObj[0].userImage){
                profileResp.userImage = appConst.base_url + respObj[0].userImage;
            }
            if(respObj[0].userImageThumbnail){
                profileResp.userImageThumbnail = appConst.base_url + respObj[0].userImageThumbnail;
            }
            if(respObj[0].userCoverImage){
                profileResp.userCoverImage = appConst.base_url + respObj[0].userCoverImage;
            }
            if(respObj[0].userCoverImageThumbnail){
                profileResp.userCoverImageThumbnail = appConst.base_url + respObj[0].userCoverImageThumbnail;
            }
        }
        return profileResp;
    }

    /**
     * To get user profile details
     * @param {integer} userID
    */
    getUserProfileDetails(callBack,userID){
        let self = this;
        /* Get user details */
        model.getSingleJoinData(function(err,results){
            if(err){
                return callBack(0,self.dbErrorResponse());
            }else{
                if(results != ""){
                    return callBack(1,results);
                }else{
                    return callBack(0,{"code":200,"response":{},"status":0,"message":appConst.user_detais_not_found});
                }
            }
        },appConst.users,appConst.user_details,'masterUserId','userId','inner',{'users.masterUserId':userID});
    }

    /**
     * To manage user device history
     * @param {integer} userID
     * @param {string} userDeviceToken
     * @param {string} userDeviceType
     * @param {string} userDeviceId
    */
    manageUserDeviceHistory(callBack,userId,userDeviceToken,userDeviceType,userDeviceId){

        let self = this;
        model.getAllWhere(function(err,results){
            if(err){
                return callBack(0,self.dbErrorResponse());
            }else{
                let dataObj = {};
                dataObj.userId = userId;
                dataObj.userDeviceToken = userDeviceToken;
                dataObj.userDeviceType = userDeviceType;
                dataObj.deviceModifiedDate = appConst.current_time;
                if(results != ""){
                    model.updateData(function(err,resp){
                        if(err){
                            return callBack(0,self.dbErrorResponse());
                        }else{
                            return callBack(1,{});
                        }
                    },appConst.users_device_history,dataObj,{userDeviceId:userDeviceId});
                }else{
                    dataObj.deviceAddedDate = appConst.current_time;
                    dataObj.userDeviceId = userDeviceId;
                    model.insertData(function(err,resp){
                        if(err){
                            return callBack(0,self.dbErrorResponse());
                        }else{
                            return callBack(1,{});
                        }
                    },appConst.users_device_history,dataObj);
                }
            }
        },appConst.users_device_history,{userDeviceId:userDeviceId});
    }

    /**
     * To manage user social verification
     * @param {integer} userID
     * @param {string} userSocialID
     * @param {string} userSocialEmailId
     * @param {string} userSocialType
     * @param {string} IsVerified
    */
    manageUserSocialVerification(callBack,userId,userSocialID,userSocialEmailId,userSocialType,IsVerified){

        let self = this;
        model.getAllWhere(function(err,results){
            if(err){
                return callBack(0,self.dbErrorResponse());
            }else{
                if(results != ""){
                    let dataObj = {};
                    dataObj.IsVerified = IsVerified;
                    model.updateData(function(err,resp){
                        if(err){
                            return callBack(0,self.dbErrorResponse());
                        }else{
                            return callBack(1,results[0].userSocialVerificationID);
                        }
                    },appConst.user_social_verifications,dataObj,{userSocialID:userSocialID});
                }else{
                    let dataObj = {};
                    dataObj.userId = userId;
                    dataObj.userSocialID = userSocialID;
                    dataObj.userSocialEmailId = userSocialEmailId;
                    dataObj.userSocialType = userSocialType;
                    dataObj.IsVerified = IsVerified;
                    dataObj.userVerificationDateTime = appConst.current_time;
                    model.insertData(function(err,resp){
                        if(err){
                            return callBack(0,self.dbErrorResponse());
                        }else{
                            return callBack(1,resp.insertId);
                        }
                    },appConst.user_social_verifications,dataObj);
                }
            }
        },appConst.user_social_verifications,{userSocialID:userSocialID});
    }

    /**
     * To unlink file
     * @param {string} filePath
    */
    unlinkFile(filePath){
        let fs  = require('fs');
        if(filePath && fs.existsSync(filePath)){
            fs.unlink(filePath);
        }
    }

    /**
     * To create image thumbnail
     * @param {string} uploadedFilePath
     * @param {string} uploadDestPath
     * @param {integer} thumbailWidth
    */
    getImgThumbnail(callBack,uploadedFilePath,uploadDestPath,thumbailWidth){
        let thumb = require('node-thumbnail').thumb;
        thumb({
          source: uploadedFilePath,
          destination: uploadDestPath,
          suffix: '-thumb',
          width:thumbailWidth,
          concurrency: 4
        }, function(files, err, stdout, stderr) {
            if(err){
                console.log('thumbnailErr',err);
                let errResp = {"code": 200,"response": {},"status": 0,"message": err.toString()};
                return callBack(0,errResp);
            }else{
                if(files){
                    let thumbFile     = files[0].dstPath;
                    let removeFileDot = thumbFile.replace("./", "");
                    let thumbnailFinalPath = removeFileDot.replace("//", "/");
                    return callBack(1,thumbnailFinalPath);
                }else{
                    let errResp = {"code": 200,"response": {},"status": 0,"message": 'Failed to generate image thumbnail.'};
                    return callBack(0,errResp);
                }
            }
        });
    }

        
}

module.exports = new Custom();

/* End of file custom.js */
/* Location: ./lib/custom.js */