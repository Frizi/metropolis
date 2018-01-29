<template>
    <div layout="row u1">
        <Sequencer
            @attack="attack"
            @release="release"
        />
        <MidiOutSelect @select="setMidiOut" />
    </div>
</template>
<script>
import Sequencer from './Sequencer.vue'
import Tone from 'tone'
import MidiOutSelect from './MidiOutSelect.vue'

export default {
    components: {
        Sequencer,
        MidiOutSelect
    },

    data () {
        return {
            midiOut: null
        }
    },

    created () {
        this._synth = new Tone.FMSynth ({
        attackNoise: 1,
        harmonicity: 0.99,
        envelope: {
            attack: 0.01,
            decay: 0.04,
            sustain: 0.7,
            release: 0.3
        },
        modulation: {
            type: 'sine'
        },
        oscillator: {
            type: 'sine'
        },

        modulationIndex: 13

        // dampening: 3000,
        // resonance: 0.6
        }).toMaster()
    },

    destroy () {
        this._synth.dispose()
    },

    methods: {
        attack (note) {
            const midi = Tone.Frequency(note).toMidi();
            this._lastMidi = midi
            switch (this.midiOut) {
                case null:
                    return this._synth.triggerAttack(note);
                default:
                    this.midiOut.send([0b10010000, midi, 127])
            }
        },

        release () {
            switch (this.midiOut) {
                case null:
                    return this._synth.triggerRelease();
                default:
                    this.midiOut.send([0b10010000, this._lastMidi, 0])
            }
        },

        setMidiOut (out) {
            this.release()
            this.midiOut = out
        }
    }
}
</script>
