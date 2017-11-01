var mandrill = require('mandrill-api/mandrill')

var _internals = {};

_internals.send = function (payload, cb) {
    const mandrillClient = new mandrill.Mandrill(payload.api_key);

    if (payload.template_name) {
        mandrillClient.messages.sendTemplate(payload, function (result) {
            cb(null, result)
        },
            function (error) {
                cb(error)
            }
        );
    } else {
        mandrillClient.messages.send(payload, function (result) {
            cb(null, result)
        },
            function (error) {
                cb(error)
            }
        );
    }
};


module.exports = function (RED) {
    'use strict';

    function Node(n) {

        RED.nodes.createNode(this, n);

        var node = this;
        var payload = {};
        
        
        this.on('input', function (msg) {
            if(typeof msg.payload === 'object'){
                payload = msg.payload;
                payload.api_key = payload.api_key ? payload.api_key : n.api_key;
                
                var message = payload.message;
                message.to = message.to ? message.to : [{email: n.to}];
                message.from_email = message.from_email ? message.from_email : n.from;
                message.subject = message.subject ? message.subject :n.subject;
                message.text = message.text ? message.text :n.text;

                payload.template_name = payload.template_name ? payload.template_name : n.template_name;
                payload.template_content = payload.template_content ? payload.template_content : [JSON.parse(n.template_content)] 
            }

            _internals.send(payload, function (err, result) {
                if (err) {
                    node.error(err, msg);
                } else {
                    payload.result = result || 'success';
                    msg.payload = payload;
                    node.send(msg);
                }
            });
        });
    }

    RED.nodes.registerType('mandrill-send', Node);
};
