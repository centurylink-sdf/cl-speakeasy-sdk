define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise'
], function (
    Config,
    Logger,
    Promise
) {

    /**
     * @class Ctl.speakeasy.AudiotonesManager
     * Manage audiotones playing
     *
     * @requires Ctl.speakeasy.Config
     * @requires Ctl.Logger
     * @requires Ctl.Promise
     */
    var AudiotonesManager = function () {

        var self = this;

        var logger = new Logger('AudiotonesManager');

        var audioContextClass = null;
        var minPlayingTime = 200;

        self.RING_IN = "ringin";
        self.RING_OUT = "ringout";
        self.BUSY = "busy";
        self.HANG_UP = "hangup";
        self.INTERRUPT = "interrupt";

        var ringInTone, ringOutTone, busyTone, hangUpTone, interruptTone;

        function getToneFromString(toneType) {
            switch (toneType) {
                case self.RING_IN:
                    return ringInTone;
                case self.RING_OUT:
                    return ringOutTone;
                case self.BUSY:
                    return busyTone;
                case self.HANG_UP:
                    return hangUpTone;
                case self.INTERRUPT:
                    return interruptTone;
                default:
                    return null;
            }
        }

        self.init = function() {

            var AudioContext = window.AudioContext || window.webkitAudioContext ||
                window.mozAudioContext || window.oAudioContext || window.msAudioContext;

            if (AudioContext) {
                audioContextClass = new AudioContext();
            }

            var audioTonesDiv = document.createElement('div');
            audioTonesDiv.id = 'audio_tones';

            // ringIn tone
            ringInTone = document.createElement('audio');
            ringInTone.id = 'ring_in_audio';
            ringInTone.loop = 'loop';

            var ringInToneSource1 = document.createElement('source');
            ringInToneSource1.src = Config.callManager.baseToneUrl + '/ringin.mp3';
            ringInToneSource1.type = 'audio/mp3';

            var ringInToneSource2 = document.createElement('source');
            ringInToneSource2.src = Config.callManager.baseToneUrl + '/ringin.ogg';
            ringInToneSource2.type = 'audio/ogg';

            ringInTone.appendChild(ringInToneSource1);
            ringInTone.appendChild(ringInToneSource2);

            // ringOut tone
            ringOutTone = document.createElement('audio');
            ringOutTone.id = 'ring_out_audio';
            ringOutTone.loop = 'loop';

            var ringOutToneSource1 = document.createElement('source');
            ringOutToneSource1.src = Config.callManager.baseToneUrl + '/ringout.mp3';
            ringOutToneSource1.type = 'audio/mp3';

            var ringOutToneSource2 = document.createElement('source');
            ringOutToneSource2.src = Config.callManager.baseToneUrl + '/ringout.ogg';
            ringOutToneSource2.type = 'audio/ogg';

            ringOutTone.appendChild(ringOutToneSource1);
            ringOutTone.appendChild(ringOutToneSource2);

            // busy tone
            busyTone = document.createElement('audio');
            busyTone.id = 'busy_audio';
            busyTone.loop = 'loop';

            var busyToneSource1 = document.createElement('source');
            busyToneSource1.src = Config.callManager.baseToneUrl + '/busy.mp3';
            busyToneSource1.type = 'audio/mp3';

            var busyToneSource2 = document.createElement('source');
            busyToneSource2.src = Config.callManager.baseToneUrl + '/busy.ogg';
            busyToneSource2.type = 'audio/ogg';

            busyTone.appendChild(busyToneSource1);
            busyTone.appendChild(busyToneSource2);

            // hangUp tone
            hangUpTone = document.createElement('audio');
            hangUpTone.id = 'hung_up_audio';

            var hangUpToneSource1 = document.createElement('source');
            hangUpToneSource1.src = Config.callManager.baseToneUrl + '/hangUp.mp3';
            hangUpToneSource1.type = 'audio/mp3';

            var hangUpToneSource2 = document.createElement('source');
            hangUpToneSource2.src = Config.callManager.baseToneUrl + '/hangUp.ogg';
            hangUpToneSource2.type = 'audio/ogg';

            hangUpTone.appendChild(hangUpToneSource1);
            hangUpTone.appendChild(hangUpToneSource2);

            // interrupt tone
            interruptTone = document.createElement('audio');
            interruptTone.id = 'interrupt_audio';
            interruptTone.loop = 'loop';

            var interruptToneSource1 = document.createElement('source');
            interruptToneSource1.src = Config.callManager.baseToneUrl + '/interrupt.mp3';
            interruptToneSource1.type = 'audio/mp3';

            var interruptToneSource2 = document.createElement('source');
            interruptToneSource2.src = Config.callManager.baseToneUrl + '/interrupt.ogg';
            interruptToneSource2.type = 'audio/ogg';

            interruptTone.appendChild(interruptToneSource1);
            interruptTone.appendChild(interruptToneSource2);


            audioTonesDiv.appendChild(ringInTone);
            audioTonesDiv.appendChild(ringOutTone);
            audioTonesDiv.appendChild(busyTone);
            audioTonesDiv.appendChild(hangUpTone);
            audioTonesDiv.appendChild(interruptTone);

            var bodyElements = document.getElementsByTagName('body');
            var body = bodyElements[0];

            body.appendChild(audioTonesDiv);
        }

        self.play = function (toneType) {
            var tone = getToneFromString(toneType);
            if (tone) {
                tone.play();
            }
        };

        self.stop = function (toneType) {
            var tone = getToneFromString(toneType);
            if (tone) {
                tone.pause();
                tone.currentTime = 0;
            }
        };

        /**
         * generate DTMF with the help of HTML5 web audio api
         * @param {String} key "0", "1", "2", etc.
         */
        self.dialTonePlay = function (key) {
            var promise = new Promise();

            if (audioContextClass) {

                if (audioContextClass.state !== "running") {
                    audioContextClass.resume();
                }

                var gainNode1, gainNode2, freq1, freq2, oscillator1, oscillator2;

                switch (key) {
                    case "0":
                        freq1 = "941.0";
                        freq2 = "1477.0";
                        break;
                    case "1":
                        freq1 = "697.0";
                        freq2 = "1209.0";
                        break;
                    case "2":
                        freq1 = "697.0";
                        freq2 = "1336.0";
                        break;
                    case "3":
                        freq1 = "697.0";
                        freq2 = "1477.0";
                        break;
                    case "4":
                        freq1 = "770.0";
                        freq2 = "1209.0";
                        break;
                    case "5":
                        freq1 = "770.0";
                        freq2 = "1336.0";
                        break;
                    case "6":
                        freq1 = "770.0";
                        freq2 = "1477.0";
                        break;
                    case "7":
                        freq1 = "852.0";
                        freq2 = "1209.0";
                        break;
                    case "8":
                        freq1 = "852.0";
                        freq2 = "1336.0";
                        break;
                    case "9":
                        freq1 = "852.0";
                        freq2 = "1477.0";
                        break;
                    case "*":
                        freq1 = "941.0";
                        freq2 = "1209.0";
                        break;
                    case "#":
                        freq1 = "941.0";
                        freq2 = "1477.0";
                        break;
                }

                // first frequency generator
                oscillator1 = audioContextClass.createOscillator();
                oscillator1.frequency.value = freq1;
                if (audioContextClass.createGain) {
                    gainNode1 = audioContextClass.createGain();
                } else if (audioContextClass.createGainNode) {
                    gainNode1 = audioContextClass.createGainNode();
                }

                if (gainNode1) {
                    oscillator1.connect(gainNode1, 0, 0);
                    gainNode1.connect(audioContextClass.destination);
                    gainNode1.gain.value = 0.1;
                    gainNode1.gain.defaultValue = 0.1;
                }

                if (oscillator1.start) {
                    oscillator1.start(0);
                } else if (oscillator1.noteOn) {
                    oscillator1.noteOn(0);
                }
                // second frequency generator
                oscillator2 = audioContextClass.createOscillator();
                oscillator2.frequency.value = freq2;
                if (audioContextClass.createGain) {
                    gainNode2 = audioContextClass.createGain();
                } else if (audioContextClass.createGainNode) {
                    gainNode2 = audioContextClass.createGainNode();
                }

                if (gainNode2) {
                    oscillator2.connect(gainNode2, 0, 0);
                    gainNode2.connect(audioContextClass.destination);
                    gainNode2.gain.value = 0.1;
                    gainNode2.gain.defaultValue = 0.1;
                }

                if (oscillator2.start) {
                    oscillator2.start(0);
                } else if (oscillator2.noteOn) {
                    oscillator2.noteOn(0);
                }
                var dialToneStop = function () {
                    if (oscillator1 && oscillator1.stop && oscillator1.disconnect) {
                        oscillator1.stop(0);
                        oscillator1.disconnect();
                    }
                    if (oscillator2 && oscillator2.stop && oscillator2.disconnect) {
                        oscillator2.stop(0);
                        oscillator2.disconnect();
                    }
                    promise.done();
                };
                setTimeout(dialToneStop, minPlayingTime);
            }
            else {
                promise.done();
            }

            return promise;
        };
    };

    return new AudiotonesManager();
});
