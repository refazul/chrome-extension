console.log('Starting content.js');

function ajax_post_data_process(post_data) {
    var post_data_array = [];
    for (var i in post_data) {
        post_data_array.push(i + '=' + encodeURIComponent(post_data[i]))
    }
    return post_data_array.join('&');
}

function ajax_post(url, post_data, callback_s, callback_f) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(ajax_post_data_process(post_data));

    function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (typeof callback_s === 'function') {
                    callback_s(httpRequest.responseText);
                }
            } else {
                console.log('There was a problem with the request.');
                if (typeof callback_f === 'function') {
                    callback_f(false);
                }
            }
        }
    }
}

function dom_search_by_text(searchText, tag_name) {
    tag_name = tag_name || 'div';

    var tags = document.getElementsByTagName(tag_name);
    var found = false;

    for (var i = 0; i < tags.length; i++) {
        if (tags[i].textContent == searchText) {
            found = tags[i];
            break;
        }
    }
    return found;
}
function dom_search_by_text_all(searchText, tag_name) {
    tag_name = tag_name || 'div';

    var tags = document.getElementsByTagName(tag_name);
    var found = [];

    for (var i = 0; i < tags.length; i++) {
        if (tags[i].textContent == searchText) {
            found.push(tags[i]);
        }
    }
    return found;
}
function dom_nth_sibling(node, n) {
    n = n || 0;
    if (node) {
        var nextSibling = node.nextSibling;
        var j = 0;
        while (nextSibling) {
            if (nextSibling.nodeType == 1) {
                if (j == n) {
                    return nextSibling;
                }
                j++;
            }
            nextSibling = nextSibling.nextSibling;
        }
    }
}
function dom_nth_child(node, n) {
    n = n || 0;
    if (node) {
        const childNodes = node.childNodes;
        for (var i = 0, j = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType == 1) {
                if (j == n) {
                    return childNodes[i];
                }
                j++;
            }
        }
    }
}
function dom_textContent_get(node) {
    if (node) {
        return node.textContent;
    }
    return '';
}

function select_selected_value_get(select_dom) {
    if (select_dom && select_dom.selectedIndex) {
        return select_dom[select_dom.selectedIndex].value;
    }
}

function string_lowercase(string) {
    if (typeof string === 'string') {
        return string.toLowerCase();
    }
    return string;
}
function string_nonempty_is(string) {
    if (typeof string === 'string' && string.length > 0) {
        return true;
    }
    return false;
}
function string_contains(string, needle) {
    // If number, convert it to string
    if (typeof string === 'number') {
        string += '';
    }
    // Check if string before checking indexOf
    if (typeof string === 'string' && string.indexOf(needle) > -1) {
        return true;
    }
    return false;
}

function window_open(url) {
    window.open(url, '_blank');
}
function window_close() {
    window.close();
}
function window_close_delayed() {
    setTimeout(function() {
        window_close();
    }, Math.floor(Math.random() * 1 * 1000) + 1);
}

function url_param_get_by_name(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function send_message_to_background(message, callback) {
    chrome.runtime.sendMessage(message, function(response_ext) {
        if (typeof callback === 'function') {
            callback(response_ext);
        }
    });
}
function open_link_delayed(url, delay) {
    setTimeout(function() {
        send_message_to_background({greeting: 'create_new_tab', url: url});
    }, delay);
}
function open_links(anchor_tags_selector, n) {
    n = n || 10;
    var links = document.querySelectorAll(anchor_tags_selector + ':not([data-processed="yes"]');
    for (var i = 0; i < n; i++) {
        var url = links[i].getAttribute('href');
        links[i].setAttribute('data-processed', 'yes');
        open_link_delayed(location.origin + url, i*5000);
    }
}

//
if (string_contains(window.location.href, 'https://masternodes.online')) {
    console.log("Running on masternodes.online");
    if (window.location.href == 'https://masternodes.online/') {
        console.log("Running on masternodes.online /");
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(request);
            if (request.greeting == "browser_action_clicked") {
                open_links('#masternodes_table a');
                sendResponse({status: "Opening Links"});
            }
        });
    }

    if (string_contains(window.location.href, 'https://masternodes.online/currencies/')) {
        console.log("Running on masternodes.online currencies");
        function coin_name_get(string) {
            if (string_nonempty_is(string)) {
                return string_lowercase(string.split('(')[1].split(')')[0]);
            }
            return string;
        }
        function coin_price_get(string) {
            if (string_nonempty_is(string)) {
                return string.split(' ')[0];
            }
            return string;
        }
        function mn_count_get(string) {
            if (string_nonempty_is(string)) {
                return string.replace(/,/g, "");
            }
            return string;
        }
        function mn_reward_freq_get(string) {
            if (string_nonempty_is(string)) {
                return string.replace(/,/g, "");
            }
            return string;
        }
        function mn_reward_total_get(string) {
            if (string_nonempty_is(string)) {
                return string.split(' ')[0].replace(/,/g, "");
            }
            return string;
        }
        function mn_collateral_get(string) {
            if (string_nonempty_is(string)) {
                return string.split(' ')[0].replace(/,/g, "");
            }
            return string;
        }
        function exchange_list_get() {
            var list = [];
            var node = dom_search_by_text('Announcement', 'a');
            if (!node) {
                node = dom_search_by_text('BB Announcement', 'a');
            }
            if (node) {
                var nodeList = [];
                if (!node.nextSibling) {
                    node = node.parentNode;
                }
                while(node = node.nextSibling) {
                    nodeList.push(node);
                }
                var t = Array.prototype.slice.call(nodeList, 0).reverse();
                for (var i in t) {
                    if (t[i].nodeType == 3 && t[i].textContent.indexOf('Buy:') > -1) {
                        break
                    }
                    if (t[i].nodeType == 1 && t[i].textContent.length > 1) {
                        list.push(t[i].textContent);
                    };
                }
            }
            return list.reverse().join(',');
        }

        var coin_name = coin_name_get(select_selected_value_get(document.querySelector('#change-coin')));
        var coin_price = coin_price_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 6), 0), 2), 0)));

        var mn_count = mn_count_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 3), 1)));
        var mn_reward_freq = mn_reward_freq_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 2), 1)));
        var mn_reward_total = mn_reward_total_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 1), 1)));
        var mn_collateral = mn_collateral_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 6), 1)));

        var exchange_list = exchange_list_get();

        console.log(coin_name, coin_price, mn_count, mn_reward_freq, mn_reward_total, mn_collateral, exchange_list);

        ajax_post('http://localhost:2000/api/v1/coins/' + coin_name, 'price=' + encodeURIComponent(coin_price) + '&mn_count=' + encodeURIComponent(mn_count) + '&mn_reward_total=' + encodeURIComponent(mn_reward_total) + '&mn_reward_freq=' + encodeURIComponent(mn_reward_freq) + '&mn_collateral=' + encodeURIComponent(mn_collateral) + '&exchanges=' + encodeURIComponent(exchange_list), function() {
            console.log('closing window');
            if (url_param_get_by_name('tab_generated') == 'yes') {
                window_close();
            }
        }, function() {
            console.log('closing window f');
            if (url_param_get_by_name('tab_generated') == 'yes') {
                window_close();
            }
        });
    }
} else if (string_contains(window.location.href, 'https://store.steampowered.com/search')) {
    function scan_page() {
        var steam_search_result = document.querySelectorAll('.search_result_row');
        if (steam_search_result.length > 0) {
            steam_search_result.forEach(function(value, key, array) {
                var link = (value.protocol && value.host && value.pathname) ? (value.protocol + '//' + value.host + value.pathname) : false;
                var title_dom = value.querySelector('.search_name .title');

                if (link && title_dom) {
                    var title = title_dom.textContent;
                    var appid = value.getAttribute('data-ds-appid');
                    var id = value.pathname.replace(/^\/|\/$/g, '').split('/').splice(0,2).join('-');

                    var release_dom = value.querySelector('.search_released');
                    var review_dom = value.querySelector('.search_review_summary')
                    var release = release_dom.textContent;
                    var review = review_dom.getAttribute('data-tooltip-html');

                    var discount_dom = value.querySelector('.search_discount span');
                    var prev_price_dom = value.querySelector('.search_price span strike');
                    var discount = discount_dom ? discount_dom.textContent : '';
                    var prev_price = prev_price_dom ? prev_price_dom.textContent : '';

                    var current_price_dom = value.querySelector('.search_price');
                    var current_price = Array.prototype.slice.call(current_price_dom.childNodes);
                    current_price.reverse();
                    current_price = current_price[0] ? current_price[0].textContent.trim() : '';

                    var data = {link: link, id: id, appid: appid, title: title, release: release, review: review, discount: discount, prev_price: prev_price, current_price: current_price};
                    //console.log(data);

                    ajax_post('http://localhost:2000/api/v1/games/steam/' + id, data, function() {}, function() {});
                }
                else {
                    console.log('something happened', value, key)
                }
            });
        }
    }
    function click_next() {
        var t = document.querySelectorAll('.pagebtn');
        t = t[t.length - 1];
        if (t.offsetWidth > 0) {
            t.click();
        }
    }
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(request);

        if (request.greeting == "browser_action_clicked") {
            scan_page();
            click_next();
            sendResponse({status: "Opening Links"});
        }
    });
} else if (string_contains(window.location.href, 'https://www.linkedin.com/learning/')) {
    function scan_page() {
        console.log('Running on Lynda');
        var video_dom = document.querySelector('video');
        var course_title_dom = document.querySelector('.course-banner__meta-title a');
        console.log('video_dom', video_dom);
        if (video_dom && course_title_dom) {
            var url = video_dom.getAttribute('src');
            var course_title = course_title_dom.textContent;
            if (url) {
                var data = {url: url, course_title: course_title}
                console.log(data);

                ajax_post('https://crescentcoder.com/api/v1/grabber/lynda', data, function() {
                    console.log('closing window');
                    if (url_param_get_by_name('tab_generated') == 'yes') {
                        window_close_delayed();
                    }
                }, function() {
                    console.log('closing window f');
                    if (url_param_get_by_name('tab_generated') == 'yes') {
                        window_close_delayed();
                    }
                });
            }
        } else {
            setTimeout(function() {
                scan_page();
            }, 1000);
        }
    }
    if (url_param_get_by_name('tab_generated') == 'yes') {
        scan_page();
    }
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(request);
        if (request.greeting == "browser_action_clicked") {
            open_links('.course-toc__list a', Math.min(document.querySelectorAll('.course-toc__list a').length, 25));
            sendResponse({status: "Opening Links", text: document.querySelectorAll('.course-toc__list a').length});
        }
    });
}
