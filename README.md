# Mobiweb Node.Js Modules  
[![](https://www.mobiwebtech.com/wp-content/themes/mobiweb/images/mobinew.png)](https://www.mobiwebtech.com/)  

Mobiweb basic modules utilities for node.js

https://www.npmjs.com/package/mobiweb-nodejs-modules

## Installation

###  npm
```shell
npm install mobiweb-nodejs-modules
```

### git

```shell
git clone https://github.com/soravmobi/mobiweb-nodejs-modules.git
```

### npmjs

```shell
https://www.npmjs.com/package/mobiweb-nodejs-modules
```

## Usage
Basic modules like user signup, verify account, login, social login, frogot password, reset password & other modules also.

* First Import SQL file, into your MySQL database.

```js
var mobiweb = require('mobiweb-nodejs-modules');
```

#### config -> constant.js

* Here we are managing all constants like database table name, defualt messages, notifiction details, site limitations etc.

#### custom (helpers) -> custom.js

* Here we are managing all custom functions like user authorization, create image thumbnail, unlink file, get user profile, also having other functions also.

#### model (DB queries) -> model.js

* Here we are managing all database queries, no need to write whole query only need to put table name, where conditions, order by, order fields other functionality also.

### For Signup

```js
app.post('/user/signup', function (req,res) {
    mobiweb.userSignup(req,res);
});


#### Required Parameters

* userFirstName   - [FIRST NAME]
* userLastName    - [LAST NAME]
* userEmail       - [UNIQUE EMAIL ID]
* userPassword    - [MD5 - ALPHA NUMERIC & 1 SPECIAL CHARACTER LIKE - Mobiweb@123]
* userGender      - [MALE,FEMALE,OTHER]
* userDOB         - [Y-M-D Format]
* userDeviceToken - [USER DEVICE TOKEN]
* userDeviceType  - [ANDROID,IOS]
* userDeviceId    - [UNIQUE DEVICE ID]

#### Note:- A temporary verification code will send on registered email id.

```

### For Login

```js
app.post('/user/login', function (req,res) {
    mobiweb.userLogin(req,res);
});


#### Required Parameters

* userEmail       - [UNIQUE EMAIL ID]
* userPassword    - [MD5 - ALPHA NUMERIC & 1 SPECIAL CHARACTER LIKE - Mobiweb@123]
* userDeviceToken - [USER DEVICE TOKEN]
* userDeviceType  - [ANDROID,IOS]
* userDeviceId    - [UNIQUE DEVICE ID]

```

### To Verify Account

```js
app.post('/user/verify-account', function (req,res) {
    mobiweb.verifyAccount(req,res);
});


#### Required Parameters

* userTempCode        - [6 digit temporary code]
* userLoginSessionKey - [User loggedin sesssion key]

```

### To re-send account verification code

```js
app.post('/user/resend-account-verification-code', function (req,res) {
    mobiweb.resendAccountVerificationCode(req,res);
});


#### Required Parameters

* userLoginSessionKey - [User loggedin sesssion key]

```

### To forgot password

```js
app.post('/user/forgot-password', function (req,res) {
    mobiweb.forgotPassword(req,res);
});


#### Required Parameters

* userEmail - [UNIQUE EMAIL ID]

```

### To verify user forgot password code

```js
app.post('/user/verify-forgot-password-code', function (req,res) {
    mobiweb.verifyForgotPasswordCode(req,res);
});


#### Required Parameters

* userTempCode        - [6 digit temporary code]
* userLoginSessionKey - [User loggedin sesssion key]

```

### To re-send forgot password code

```js
app.post('/user/resend-forgot-password-code', function (req,res) {
    mobiweb.resendForgotPasswordCode(req,res);
});


#### Required Parameters

* userLoginSessionKey - [User loggedin sesssion key]

```

### To reset user password

```js
app.post('/user/reset-password', function (req,res) {
    mobiweb.resetPassword(req,res);
});


#### Required Parameters

* userLoginSessionKey,newPassword,confirmPassword

```

### To user contact us

```js
app.post('/user/contact-us', function (req,res) {
    mobiweb.contactUs(req,res);
});


#### Required Parameters

* contactName,contactPhone,contactEmail,contactMessage

```

### To get user profile details

```js
app.post('/user/view-profile', function (req,res) {
    mobiweb.viewProfile(req,res);
});


#### Required Parameters

* userLoginSessionKey

```

### To update user profile

```js
app.post('/user/update-profile', function (req,res) {
    mobiweb.updateProfile(req,res);
});


#### Required Parameters

* userLoginSessionKey,userFirstName,userLastName,userGender,userDOB,userCountry,userCity,userAddress,userLatitude,userLongitude

```

### To upload user profile & cover images

```js
app.post('/user/upload-user-image', function (req,res) {
    mobiweb.uploadUserImage(req,res);
});


#### Required Parameters

* userLoginSessionKey,userFile,fileUploadType (PROFILE_IMG,PROFILE_IMG)

#### Note:- Will also generate image thumbnail.

```

### To change user password

```js
app.post('/user/change-password', function (req,res) {
    mobiweb.changePassword(req,res);
});


#### Required Parameters

* userLoginSessionKey,oldPassword,newPassword,confirmPassword

```

#### lib -> notification.js

* Here we are managing Android & IOS mobile app push notification.

### To Send Push Notification

```js
var appRoot  = require('app-root-path');
var notification = require(appRoot + '/lib/notification.js');

#### For Android (FCM) :-

notification.sendAndroidNotification(userDeviceToken,userMessage,extraParams);

#### For IOS (APNS) :-

notification.sendIOSNotification(userDeviceToken,userMessage,userBadges,extraParams);

#### For Both Android & IOS (FCM + APNS) :-

notification.sendPushNotifications(userMessage,userId,extraParams);

Note:- sendPushNotifications() method is used to send notification on multiple devices, for example if same user logged in on Android & IOS device then notification will fire on all logged in devices.

```

### Last Activity Management (Session - For Security)

```shell
Now we are saving user last activity date time in database, if last activity date time is 6 or more then 6 hours old, then session will expired & automatically login session key will changed, a new login session key will allocate for that user. We can also change this session limit from constant file using "session_limit" constant.
```