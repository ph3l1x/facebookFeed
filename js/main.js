tizen.power.request("SCREEN", "SCREEN_NORMAL");

$("document").ready(function () {

    var appID = '896778317084638';

    function authPoll(data) {
        var formData = {
            type: "device_token",
            client_id: appID,
            code: data.code
        };
        return $.ajax({
            type: "POST",
            dataType: "json",
            url: "https://graph.facebook.com/oauth/device",
            data: formData
        });
    }
    $("#button-click").click(function () {
        var formData = {
            type: "device_code",
            client_id: appID,
            scope: "public_profile,user_likes"
        };

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "https://graph.facebook.com/oauth/device",
            data: formData,
            success: function (data) {
                localStorage['code'] = data.code;
            	$('#button-container').html(
                    '<div class="fbReturn">' +
                    '  <div class="description">' +
                    '       You must validate your account. ' +
                    '       From another device make sure that you are logged into your facebook account and visit: <div>' +
                            data.verification_uri +
                    '       </div>and type the activation code: <div>' +
                            data.user_code +
                    '       </div>This code will expire in: <div>' +
                            data.expires_in / 60 +
                    '       minutes</div>' +
                    '</div>'
                );
                var times = data.expires_in / 5,
                    runTime = 0,
                    interval = setInterval(function () {
                        if (runTime < times) {
                            authPoll(data).then(function (returnedInfo) {
                                var token = returnedInfo.access_token;
                                    //expires_in = returnedInfo.expires_in;
                                if (token) {
                                    clearInterval(interval);
                                    localStorage['accesstoken'] = token;
                                    authData = {
                                        fields: "name,picture",
                                        access_token: localStorage['accesstoken']
                                    };
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: "https://graph.facebook.com/v2.3/me",
                                        data: authData,
                                        success: function(data) {
                                            localStorage['uid'] = data.id;
                                            localStorage['name'] = data.name;
                                            localStorage['pictureUrl'] = data.picture.data.url;
                                            $('#button-container').html(
                                                '<div class="fbReturn">' +
                                                '  <div class="success"><h2>Success!</h2></div>' +
                                                '  <div class="successContainer">' +
                                                '       <div class="userPicture"><img src="' + localStorage['pictureUrl'] + '"></div>' +
                                                '       <div class="userRight">' +
                                                '          <div class="userName">' + localStorage['name'] + ',</div>' +
                                                '          <div class="userText">You are now logged in.</div>' +
                                                '       </div>' +
                                                '       <div class="continueButton">Continue</div>' +
                                                '</div>'
                                            )
                                        }
                                    });
                                }
                            });
                            runTime += 1;
                        } else {
                            clearInterval(interval);
                        }
                    }, 5000);
            }
        });
    });
});