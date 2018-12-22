console.log('Starting content.js');

function ajax_post(url, post_data, callback_s, callback_f) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(post_data);

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

//
if (string_contains(window.location.href, 'https://masternodes.online')) {
    console.log("Running on masternodes.online");
    function open_links() {
        var links = document.querySelectorAll('#masternodes_table a:not([data-processed="yes"]');
        for (var i = 0; i < 10; i++) {
            var url = links[i].getAttribute('href');
            send_message_to_background({greeting: 'create_new_tab', url: location.origin + url});
            links[i].setAttribute('data-processed', 'yes');
        }
    }
    if (window.location.href == 'https://masternodes.online/') {
        console.log("Running on masternodes.online /");
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(request);
            if (request.greeting == "open_links") {
                open_links();
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

        var coin_name = coin_name_get(select_selected_value_get(document.querySelector('#change-coin')));
        var coin_price = coin_price_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 6), 0), 2), 0)));

        var mn_count = mn_count_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 3), 1)));
        var mn_reward_freq = mn_reward_freq_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 2), 1)));
        var mn_reward_total = mn_reward_total_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 1), 1)));
        var mn_collateral = mn_collateral_get(dom_textContent_get(dom_nth_child(dom_nth_child(dom_nth_child(dom_nth_child(document.querySelector('#masternode-stats'), 10), 0), 6), 1)));

        console.log(coin_name, coin_price, mn_count, mn_reward_freq, mn_reward_total, mn_collateral);

        ajax_post('http://localhost:2000/api/v1/coins/' + coin_name, 'price=' + encodeURIComponent(coin_price) + '&mn_count=' + encodeURIComponent(mn_count) + '&mn_reward_total=' + encodeURIComponent(mn_reward_total) + '&mn_reward_freq=' + encodeURIComponent(mn_reward_freq) + '&mn_collateral=' + encodeURIComponent(mn_collateral), function() {
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
}
