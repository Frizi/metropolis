<template>
    <select v-model="selected">
        <option :value="null">builtin synth</option>
        <option v-for="o in outputs" :key="o.id" :value="o">{{o.name}}</option>
    </select>
</template>
<script>

import { midiAccess } from '../midi'

export default {
    data () {
        return {
            selection: null,
            outputs: []
        }
    },
    computed: {
        selected: {
            get () {
                return this.selection
            },
            set (v) {
                this.selection = v
                this.$emit('select', v)
            }
        }
    },

    created () {
        midiAccess.then( this.onMIDISuccess )
    },
    methods: {
        onMIDISuccess (midi) {
            this._midi = midi
            this.handleOutputs()
            midi.addEventListener('statechange', (e) => {
                if (e.output) this.handleOutputs()
            })
        },
        handleOutputs () {
            const outs = []
            this._midi.outputs.forEach(out => {
                outs.push(out)
            })
            this.outputs = outs
            console.log(outs)
            console.log(this.outputs)
        }
    }
}
</script>
