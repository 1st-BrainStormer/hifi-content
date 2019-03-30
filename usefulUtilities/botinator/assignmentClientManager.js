//
//
//  Botinator
//  assignmentClientManager.js
//  Created by Milad Nazeri on 2019-03-28
//  Copyright 2019 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
//  Manages the differnt ac scripts needed
//
//


(function () {

    // *************************************
    // START UTILITY FUNCTIONS
    // *************************************
    // #region UTILITY FUNCTIONS   
    

    console.log("\n\n\nC-v13\n\n\n");
    // Use a ring to cycle through the list for as many unique recordings as are available
    function findValue(index, array, offset) {
        offset = offset || 0;
        return array[(index + offset) % array.length];
    }
    

    // Random Float helper for the location
    function randFloat(low, high) {
        return low + Math.random() * (high - low);
    }


    // Get a random location based on the user's desired min and max range.   
    function getRandomLocation(contentBoundaryCorners) {
        contentBoundaryCorners = fixupContentBoundaryCorners(contentBoundaryCorners);
        return { 
            x: randFloat(contentBoundaryCorners[0][X], contentBoundaryCorners[1][X]), 
            y: randFloat(contentBoundaryCorners[0][Y], contentBoundaryCorners[1][Y]), 
            z: randFloat(contentBoundaryCorners[0][Z], contentBoundaryCorners[1][Z]) 
        };
    }


    // Stop all the bots currently playing
    function stopAllBots(){
        console.log("STOP ALL BOTS")
        availableAssignmentClientPlayers.forEach(function(ac){
            ac.stop();
        });
        botCount = 0;
        currentlyRunningBots = false;
    }


    // Update all the current positions for the bots
    function updateAllBotsPosition(){
        var position = getRandomLocation(contentBoundaryCorners);
        availableAssignmentClientPlayers.forEach(function(ac){
            ac.setPosition(position);
        });
    }

    
    // Update all the current volumes for the bots
    function updateAllBotsVolume(){
        availableAssignmentClientPlayers.forEach(function(ac){
            ac.setVolume(volume);
        });
    }


    // Start playing sequence to fill players with bots
    var AC_AVAILABILITY_CHECK_MS = 1000;
    function startSequence(){
        console.log("in start sequence");
        console.log("botCount", botCount);
        console.log("totalNumberOfBots", totalNumberOfBotsNeeded);

        // Check to see how many bots are needed
        if (botCount >= totalNumberOfBotsNeeded) {
            return;
        }

        if (botCount < availableAssignmentClientPlayers.length) {
            var player = availableAssignmentClientPlayers[botCount];
            player.play();
            botCount++;

            if (botCount >= totalNumberOfBotsNeeded) {
                return;
            }
        }

        Script.setTimeout(function(){
            startSequence();
        }, AC_AVAILABILITY_CHECK_MS);
    }


    // The following borrowed from Zach's push preventer script
    // A utility function used to ensure that all of the values in "box corner 1" are less than
    // those in "box corner 2"
    function maybeSwapCorners(contentBoundaryCorners, dimension) {
        var temp;
        if (contentBoundaryCorners[0][dimension] > contentBoundaryCorners[1][dimension]) {
            temp = contentBoundaryCorners[0][dimension];
            contentBoundaryCorners[0][dimension] = contentBoundaryCorners[1][dimension];
            contentBoundaryCorners[1][dimension] = temp;
        }
        return [contentBoundaryCorners[0][dimension], contentBoundaryCorners[1][dimension]];
    }


    // Ensures that all of the values in "box corner 1" are less than those in "box corner 2".
    function fixupContentBoundaryCorners(contentBoundaryCorners) {
        var x = maybeSwapCorners(contentBoundaryCorners, X);
        var y = maybeSwapCorners(contentBoundaryCorners, Y);
        var z = maybeSwapCorners(contentBoundaryCorners, Z);
        return [
            [x[0], y[0], z[0]],
            [x[1], y[1], z[1]]
        ];
    }

    // #endregion
    // *************************************
    // END UTILITY FUNCTIONS
    // *************************************

    // *************************************
    // START CONSTS_AND_VARS
    // *************************************
    // #region CONSTS_AND_VARS


    var X = 0;
    var Y = 1;
    var Z = 2;

    // List of possible bots to use    
    var BOTS = Script.require("./botsToLoad.js");

    // The Assignment Client channel
    var ASSIGNMENT_MANAGER_CHANNEL = "ASSIGNMENT_MANAGER_CHANNEL";
    var ASSIGNMENT_CLIENT_MESSANGER_CHANNEL = "ASSIGNMENT_CLIENT_MESSANGER_CHANNEL";

    // Array of the assignment client players and their assignment client player object
    var availableAssignmentClientPlayers = [];

    // Total number of bots needed
    var totalNumberOfBotsNeeded = 0;

    // Current playing bot count we are at
    var botCount = 0;

    // Current registered bount count
    var botRegisterdCount = 0;

    // Range to pull the random location from    
    var contentBoundaryCorners = [[0,0,0], [0,0,0]];

    // Check for if currently running
    var currentlyRunningBots = false;

    // Volume the bots should play at
    var volume = 1.0;


    // #endregion
    // *************************************
    // END CONSTS_AND_VARS
    // *************************************

    // *************************************
    // START ASSIGNMENT_CLIENT_PLAYER
    // *************************************
    // #region ASSIGNMENT_CLIENT_PLAYER


    // Individual AssignmentClientPlayerObject
    function AssignmentClientPlayerObject(uuid, fileToPlay, position, volume) {
        this.uuid = uuid;
        this.fileToPlay = fileToPlay;
        this.position = position;
        this.volume = volume;
    }


    // Sets the position to play this bot at
    function setPosition(position) {
        this.position = position;
    }

    // Sets the volume to play this bot at
    function setVolume(volume) {
        this.volume = volume;
    }


    // Play the current clip
    function play(){
        Messages.sendMessage(ASSIGNMENT_MANAGER_CHANNEL, JSON.stringify({
            action: "PLAY",
            fileToPlay: this.fileToPlay,
            position: this.position,
            uuid: this.uuid
        }));
    }


    // Stop the current clip
    function stop(){
        Messages.sendMessage(ASSIGNMENT_MANAGER_CHANNEL, JSON.stringify({
            action: "STOP",
            uuid: this.uuid
        }));
    }


    AssignmentClientPlayerObject.prototype = {
        setPosition: setPosition,
        play: play,
        setVolume: setVolume,
        stop: stop
    };


    // #endregion
    // *************************************
    // END ASSIGNMENT_CLIENT_PLAYER
    // *************************************
    
    // *************************************
    // START MESSAGES
    // *************************************
    // #region MESSAGES


    Messages.subscribe(ASSIGNMENT_MANAGER_CHANNEL);
    Messages.subscribe(ASSIGNMENT_CLIENT_MESSANGER_CHANNEL);

    // Handle Messages received
    function onMangerChannelMessageReceived(channel, message, sender) {
        try {
            message = JSON.parse(message);
        } catch (error) {
            console.log("invalid object");
            console.log("MESSAGE:", message);

            return;
        }

        if (channel !== ASSIGNMENT_MANAGER_CHANNEL || sender === Agent.sessionUUID) {
            return;
        }

        console.log("MESSAGE IN MANAGER", JSON.stringify(message));

        switch (message.action) {
            case "REGISTER_ME":
                var fileName = findValue(botRegisterdCount, BOTS);
                var position = getRandomLocation(contentBoundaryCorners);
                availableAssignmentClientPlayers.push( 
                    new AssignmentClientPlayerObject(message.uuid, fileName, position, volume));
                botRegisterdCount++;
                var messageToSend = JSON.stringify({
                    action: "AC_AVAILABLE_UPDATE",
                    newAvailableACs: availableAssignmentClientPlayers.length
                });
                console.log("message:", messageToSend);
                Messages.sendMessage(ASSIGNMENT_CLIENT_MESSANGER_CHANNEL, messageToSend);
                break;
            case "ARE_YOU_THERE_MANAGER_ITS_ME_BOT":
                Messages.sendMessage(ASSIGNMENT_MANAGER_CHANNEL, JSON.stringify({
                    action: "REGISTER_MANAGER",
                    uuid: sender
                }));
                break;
            default:
                console.log("unrecongized action in assignmentClientManger.js");
                break;
        }
    }


    function onTabletChannelMessageReceived(channel, message, sender){
        try {
            message = JSON.parse(message);
        } catch (error) {
            console.log("MESSAGE:", message);
            console.log("invalid object");
            return;
        }

        if (channel !== ASSIGNMENT_CLIENT_MESSANGER_CHANNEL || sender === Agent.sessionUUID) {
            return;
        }

        console.log("MESSAGE IN MANAGER FROM TABLET", JSON.stringify(message));

        switch (message.action) {
            case "SEND_DATA":
                console.log("in refresh settings");
                if (currentlyRunningBots) {
                    stopAllBots();
                    currentlyRunningBots = false;
                }   

                if (JSON.stringify(contentBoundaryCorners) !== 
                    JSON.stringify(message.contentBoundaryCorners)) {
                    contentBoundaryCorners = message.contentBoundaryCorners;
                    updateAllBotsPosition();
                }

                if (volume !== message.volume) {
                    volume = message.contentBoundaryCorners;
                    updateAllBotsVolume();
                }

                totalNumberOfBotsNeeded = message.totalNumberOfBotsNeeded;
                break;
            case "PLAY":
                console.log("in play");
                if (currentlyRunningBots) {
                    return;
                }
                currentlyRunningBots = true;
                startSequence();
                break;
            case "STOP":
                console.log("in stop");
                if (currentlyRunningBots) {
                    stopAllBots();
                }
                break;
            case "GET_MANAGER_STATUS":
                var messageToSend = JSON.stringify({
                    action: "GET_MANAGER_STATUS",
                    newAvailableACs: availableAssignmentClientPlayers.length,
                    currentlyRunningBots: currentlyRunningBots
                });
                console.log("message:", messageToSend);
                Messages.sendMessage(ASSIGNMENT_CLIENT_MESSANGER_CHANNEL, messageToSend);
                break;
            default:
                console.log("unrecongized action in assignmentClientManger.js");
                break;
        }
    }


    // #endregion
    // *************************************
    // END MESSAGES
    // *************************************

    // *************************************
    // START MAIN
    // *************************************
    // #region MAIN
    
    
    // Startup for the manager when it comes online
    function startUp(){
        Messages.messageReceived.connect(onMangerChannelMessageReceived);
        Messages.messageReceived.connect(onTabletChannelMessageReceived);
        Script.scriptEnding.connect(onEnding);
    }    
    
    startUp();
    

    // #endregion
    // *************************************
    // END MAIN
    // *************************************

    // *************************************
    // START CLEANUP
    // *************************************
    // #region CLEANUP

    
    // Cleanup the manager and it's messages
    function onEnding(){
        Messages.messageReceived.disconnect(onMangerChannelMessageReceived);
        Messages.messageReceived.disconnect(onTabletChannelMessageReceived);
        var messageToSend = JSON.stringify({
            action: "GET_MANAGER_STATUS",
            newAvailableACs: 0,
            currentlyRunningBots: false,
            closeTablet: true
        });
        console.log("message:", messageToSend);
        Messages.sendMessage(ASSIGNMENT_CLIENT_MESSANGER_CHANNEL, messageToSend);
    }


    // #endregion
    // *************************************
    // END CLEANUP
    // *************************************

})();

