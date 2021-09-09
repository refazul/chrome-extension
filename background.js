// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
console.log("Hello");

function url_query_param_add(url, key, value) {
    if (url) {
        if (url.indexOf('?') > -1) {
            url = url + '&' + key + '=' + value;
        } else {
            url = url + '?' + key + '=' + value;
        }
    }
    return url;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == 'create_new_tab') {
        if (request.url) {
            var url = url_query_param_add(request.url, 'tab_generated', 'yes');
            if (url) {
                setTimeout(function() {
                    chrome.tabs.create({
                        url: url
                    }, function() {});
                }, Math.floor(Math.random() * 1 * 1000) + 1);
            }
        }
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    //if (tab.url.indexOf('https://masternodes.online') > -1) {
        chrome.tabs.sendMessage(tab.id, {
            greeting: "browser_action_clicked"
        }, null, function(response) {
            console.log(response);
            if (response.text) {
                chrome.browserAction.setBadgeText({text: response.text + ''});
            }
            if (response.video_link) {
                var video_link = response.video_link;
                var video_filename = response.video_filename || video_link.split('/').pop()
                chrome.downloads.download({
                    url: video_link,
                    filename: video_filename // Optional
                });                  
            }
        });
        //return;
    //}
    // No tabs or host permissions needed!
    chrome.tabs.executeScript({
        code: `
            
        `,
        allFrames: true
    });
});
