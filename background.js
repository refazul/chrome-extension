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
    if (tab.url.indexOf('https://masternodes.online') > -1) {
        chrome.tabs.sendMessage(tab.id, {
            greeting: "open_links"
        }, function(response) {
            console.log(response);
        });
        return;
    }
    // No tabs or host permissions needed!
    chrome.tabs.executeScript({
        code: `
            console.log("Running");
            var video_link = false;
            if (document.querySelector('video')) {
                video_link = document.querySelector('video').getAttribute('src');
            }
            if (!video_link) {
                // PH
                if (document.querySelector('video source')) {
                    video_link = document.querySelector('video source').getAttribute('src');
                }
            }
            if (!video_link) {
                // URPRN.SY
                if (document.querySelector('video#player_el')) {
                    video_link = document.querySelector('video#player_el').getAttribute('src');
                }
            }
            console.log('video_link', video_link);
            if (video_link) {
                window.open(video_link, '_blank');
            }
        `,
        allFrames: true
    });
});
