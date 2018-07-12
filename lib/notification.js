"use strict";

/*
 * Purpose: To send emails
 * Authur : Sorav Garg
 * Company: Mobiweb Technology Pvt. Ltd.
*/

var appRoot  = require('app-root-path'),
	appConst = require(appRoot + '/config/constant.js');

class Notification {

	/* Notification Constructor */
	constructor() {
	}

	/**
	 * To send android push notifications
	 * @param {string} userDeviceToken
	 * @param {string} userMessage
	 * @param {object} extraParams
	*/
    sendAndroidNotification(callBack,userDeviceToken,userMessage,extraParams = {}){
		let FCM = require('fcm-push');
		let fcm = new FCM(appConst.fcm_server_key);
		extraParams.userMessage = userMessage;
		let message = {
					    to: userDeviceToken,
					    collapse_key: appConst.site_name, 
					    data: extraParams,
					    priority:"high",
					    notification: {
					        body: userMessage,
					        title:extraParams
					    }
					};
		fcm.send(message, function(err, response){
		    if (err) {
		        console.log("Android notification error",err);
		        return callBack(err, response);
		    } else {
		        console.log("Android notification response",response);
		        return callBack(err, response);
		    }
		});
    }

    /**
	 * To send IOS push notifications
	 * @param {string} userDeviceToken
	 * @param {string} userMessage
	 * @param {integer} userBadges
	 * @param {object} extraParams
	*/
    sendIOSNotification(callBack,userDeviceToken,userMessage,userBadges = 0,extraParams = {}){
    	let apn = require('apn');
    	let options = {
					  token: {
					    key   : appRoot + "/apns/AuthKey_VZXKXUUMZ5.p8",
					    keyId : "VZXKXUU111",
					    teamId: "Z2ZDY9LZ3R"
					  },
					  production: false
					};
    	let apnProvider = new apn.Provider(options);
    	let note     = new apn.Notification();
    	note.badge   = parseInt(userBadges);
    	note.alert   = userMessage;
    	note.payload = extraParams;
    	note.sound   = "default";
    	note.topic   = "com.mobiweb-sj.QuickLove";
    	apnProvider.send(note, userDeviceToken).then( (result) => {
		  console.log('result',result);
		  return callBack(result);
		});
    }

    /**
	 * To send mobile push notifications
	 * @param {string} userMessage
	 * @param {integer} userId
	 * @param {object} extraParams
	*/
    sendPushNotifications(userMessage,userId,extraParams = {}){
    	let model = require(appRoot + '/lib/model.js');
    	let self  = this; 

    	/* Get User Details */
    	model.getAllWhere(function(err,userDetails){
    		if(err){
    			console.log('sendPushNotificationsError',err);
    			return;
    		}else{
    			if(userDetails != "" && parseInt(userDetails[0].userEmailVerified) === 1 && parseInt(userDetails[0].isUserBlocked) === 0 && parseInt(userDetails[0].isUserDeactivated) === 0){

    				/* User Badges (Notification Count) */
    				let userBadges = parseInt(userDetails[0].userBadges);
    				extraParams.userBadges = userBadges;
    				console.log('extraParams',extraParams);

    				/* To get user devices history */
    				model.getAllWhere(function(err,userDevicesObj){
    					if(err){
			    			console.log('sendPushNotificationsError',err);
			    			return;
			    		}else{
			    			if(userDevicesObj != ""){
			    				let totalDevices = parseInt(userDevicesObj.length);
			    				if(totalDevices > 0)
			    				{
			    					/* Send notification to users on all logged in devices */
			    					for (var i = 0; i < totalDevices; i++) 
			    					{
			    						/* To get user device type */
			    						let userDeviceType = userDevicesObj[i].userDeviceType;
			    						if(userDeviceType === 'ANDROID'){

			    							/* Send notification on android */
			    							self.sendAndroidNotification(function(err,androidNotificationResp){
			    							},userDevicesObj[i].userDeviceToken,userMessage,extraParams);
			    						}else{
			    							/* Send notification on ios */
			    							self.sendIOSNotification(function(err,iosNotificationResp){
			    							},userDevicesObj[i].userDeviceToken,userMessage,userBadges,extraParams);
			    						}
			    					}
			    				}
			    			}else{
			    				/* When user is logged out or didn`t login yet */
			    				console.log('sendPushNotificationsError','User device history not found');
			    			}
			    		}
    				},appConst.users_device_history,{userId:userId});
    			}else{
    				console.log('sendPushNotificationsError','User details not found');
    			}
    		}
    	},appConst.user_details,{userId:userId});
  	};



}

module.exports = new Notification();

/* End of file notification.js */
/* Location: ./lib/notification.js */