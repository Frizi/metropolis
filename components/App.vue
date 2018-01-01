<template>
    <Sequencer
        @attack="attack"
        @release="release"
    />
</template>
<script>
import Sequencer from './Sequencer.vue'
import Tone from 'tone'


export default {
    components: {
        Sequencer
    },

    created () {
        this._synth = new Tone.FMSynth ({}).toMaster()
    },

    destroy () {
        this._synth.dispose()
    },

    methods: {
        attack (note) {
            this._synth.triggerAttack(note);
        },

        release () {
            this._synth.triggerRelease();
        }
    }
}
</script>
