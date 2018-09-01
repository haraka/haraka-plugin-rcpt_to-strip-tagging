'use strict';

exports.hook_queue = function (next, connection) {
    const txn = connection.transaction;
    for (let i=0; i<txn.rcpt_to.length; i++) {
        connection.logdebug(`Address before: ${txn.rcpt_to[i].format()}`);
        txn.rcpt_to[i].user = txn.rcpt_to[i].user.replace(/[+-].*?$/, '');
        connection.logdebug(`Address after: ${txn.rcpt_to[i].format()}`);
    }
    next();
}
