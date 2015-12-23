$("document").ready(function () {

    /***************************************************************
     * Check if logged in and preset authentication process if not *
     ***************************************************************/

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
                $('.button-container').html(
                    '<div class="test">' +
                    '  <div class="url">Login URL: <a target="_BLANK" href="' + data.verification_uri + '">' + data.verification_uri + '</a></div>' +
                    '  <div class="code">Actication Code: ' + data.user_code + '</div>' +
                    '  <div class="expires">Expires in: ' + data.expires_in / 60 + ' minutes</div>' +
                    '</div>'
                );
                var times = data.expires_in / 5,
                    runTime = 0,
                    token = '';

                var interval = setInterval(function () {
                    if (runTime < times) {
                        authPoll(data).then(function (returnedInfo) {
                            var token = returnedInfo.access_token,
                                expires_in = returnedInfo.expires_in;
                            if (token) {
                                clearInterval(interval);
                                $('.button-container').html(
                                    '<div class="test">' +
                                    '  <div class="token">Token: ' + token + '</div>' +
                                    '  <div class="expiresIn">Expires In: ' + expires_in + '</div>' +
                                    '</div>'
                                );
                            }
                        });
                        runTime += 1;
                    } else {
                        clearInterval(interval);
                    }
                }, 5000);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("ERROR");
            }
        })

    });

    /******************************************************
     * Show Facebook Info after successful Authentication *
     ******************************************************/
    console.log(window.fbToken);
    console.log(window.expiresIn);
});