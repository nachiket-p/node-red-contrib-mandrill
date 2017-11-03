module.exports = function(RED) {
    function MandrillConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.api_key = n.api_key;
    }
    RED.nodes.registerType("mandrill-config",MandrillConfigNode);
}