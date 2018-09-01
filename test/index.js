'use strict';

process.env.NODE_ENV = 'test';

const assert   = require('assert');
const fixtures = require('haraka-test-fixtures');
const Address = require('address-rfc2821').Address;

const strip_tag = new fixtures.plugin('index');

describe('strip_tagging', () => {
    it('strips tags using + as delimiter', (done) => {
        strip_test('<user+tag@example.com>', 'user+tag', 'user', done);
    });
    it('strips tags using - as delimiter', (done) => {
        strip_test('<user-tag@example.com>', 'user-tag', 'user', done);
    });
    it('leaves untagged email addresses alone', (done) => {
        strip_test('<user@example.com>', 'user', 'user', done);
    });
});

function strip_test (email, before, after, done) {
    const connection = fixtures.connection.createConnection();
    connection.init_transaction();
    const txn = connection.transaction;

    txn.rcpt_to[0] = new Address(email);
    assert.equal(txn.rcpt_to[0].user, before);

    strip_tag.hook_queue(after_hook, connection);

    function after_hook () {
        assert.equal(txn.rcpt_to[0].user, after);
        done();
    }
}
