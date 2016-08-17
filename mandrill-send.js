var mandrill = require('mandrill-send')

var _internals = {};

_internals.send = function (payload, cb) {
    
   var email = mandrill(payload.api_key);

   email(payload, function(err){
      cb(err)
    });
};


module.exports = function(RED) {
    'use strict';

    function Node(n) {
      
        RED.nodes.createNode(this,n);

        var node = this;
        

        this.on('input', function (msg) {
            
            var payload = typeof msg.payload === 'object' ? msg.payload : {};
        
            var attrs = ['api_key','from','to','subject','html'];
            for (var attr of attrs) {
                if (n[attr]) {
                    payload[attr] = n[attr];     
                }
            }

            _internals.send(payload, function(err, result){
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
