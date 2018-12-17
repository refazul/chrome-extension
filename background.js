// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
console.log("Hello");
chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    chrome.tabs.executeScript({
        code: `
            console.log("Running");
            var video_link = false;
            // PH
            if (document.querySelector('video')) {
                video_link = document.querySelector('video').getAttribute('src');
            }
            if (document.querySelector('video source')) {
                video_link = document.querySelector('video source').getAttribute('src');
            }
            if (!video_link) {
                // URPRN.SY
                if (document.querySelector('video#player_el')) {
                    video_link = document.querySelector('video#player_el').getAttribute('src');
                }
            }
            console.log(video_link);
            if (video_link) {
                window.open(video_link, '_blank');
            }


            // URPRN.SY Container Page
            var pages = document.querySelectorAll('.search_results .post_el_small > a');
            var limit = 3;
            var count = 0;
            for (var i = 0; i < pages.length; i++) {
                //console.log(pages[i].getAttribute('href'));

                if (pages[i].getAttribute('data-loaded') == 'yes') {
                    continue;
                }
                count++;
                if (count > limit) {
                    break;
                }
                pages[i].setAttribute('data-loaded', 'yes');
                window.open(pages[i].getAttribute('href'), '_blank');
            }
        `,
        allFrames: true
    });
});
