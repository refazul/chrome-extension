// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
console.log("Hello");
const ajax = `
function ajax_post(url, data) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(data);
}

function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            var response = JSON.parse(httpRequest.responseText);
            console.log(response.computedString);
        } else {
            console.log('There was a problem with the request.');
        }
    }
}
`;

const dom = `
function dom_search_by_text(searchText) {
    var aTags = document.getElementsByTagName("td");
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            break;
        }
    }
    return found;
}
function dom_next_sibling_content_get(node) {
    if (node && node.nextSibling) {
        var nextSibling = node.nextSibling
        while (nextSibling) {
            if (nextSibling.nodeType == 1) {
                return nextSibling.innerText;
            }
            nextSibling = nextSibling.nextSibling;
        }
    }
}
`;

chrome.browserAction.onClicked.addListener(function(tab) {
    if (tab.url.indexOf('https://masternodes.online/currencies/') > -1) {
        chrome.tabs.executeScript({
            code: `
                console.log("Running on masternodes.online");
                var coin_name = 'dash';
                var coin_price = 0.001;
                var mn_count = 3;
                var mn_reward_total = '20.33';
                var mn_reward_freq = '5d';

                ${ajax}

                ${dom}

                mn_count = dom_next_sibling_content_get(dom_search_by_text('Active masternodes:'));
                mn_reward_freq = dom_next_sibling_content_get(dom_search_by_text('AVG masternode reward frequency:'));
                mn_reward_total = dom_next_sibling_content_get(dom_search_by_text('Paid rewards for masternodes:')).split(' ')[0];

                ajax_post('http://localhost:2000/api/v1/coins/dash', 'price=' + encodeURIComponent(coin_price) + '&mn_count=' + encodeURIComponent(mn_count) + '&mn_reward_total=' + encodeURIComponent(mn_reward_total) + '&mn_reward_freq=' + encodeURIComponent(mn_reward_freq));

            `
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
