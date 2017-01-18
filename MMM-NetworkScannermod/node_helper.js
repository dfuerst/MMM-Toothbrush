/* global require, module */
/* Magic Mirror
 * Node Helper: MMM-NetworkScannermod
 *
 * By Ian Perrin http://ianperrin.com
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var sudo = require("sudo");


module.exports = NodeHelper.create({
    start: function function_name () {
        console.log("Starting module: " + this.name);
    },

    // Override socketNotificationReceived method.
    socketNotificationReceived: function(notification, payload) {
        console.log(this.name + ' received ' + notification);

        if (notification === "SCAN_NETWORK") {
            this.config = payload;
            this.scanNetwork();
            return true;
        }
    },

    scanNetwork: function() {
        console.log(this.name + " is scanning for mac addresses");

        var self = this;
        var hci = sudo(['hcitool', 'con']);
        var buffer = '';
        var errstream = '';

        hci.stdout.on('data', function (data) {
            buffer += data;
        });

        hci.stderr.on('data', function (data) {
            errstream += data;
        });

        hci.on('error', function (err) {
            errstream += err;
        });

        hci.on('close', function (code) {
            if (code !== 0) {
                console.log(self.name + " received an error running hcitool: " + code + " - " + errstream);
                return;
            }
            //Parse the response
            var rows = buffer.split('\n');
            var macAddresses = [];

            // HCI-TOOL SCAN table
            for (var i = 1; i < rows.length; i++) {
                var cells = rows[i].split(' ').filter(String);
                if (cells[2] && macAddresses.indexOf(cells[2].toUpperCase()) === -1) {
                    macAddresses.push(cells[2].toUpperCase());
                }
            }

            self.sendSocketNotification('MAC_ADDRESSES', macAddresses);
	    console.log(macAddresses);
        });

    }
});