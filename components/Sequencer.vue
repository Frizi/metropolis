<template>
  <div layout="row u3">
        <Stage
            v-for="(s, n) in stageSettings"
            :key="n" :stage="s"
            :active="gate && n === displayStage"
            :manual="manual"
            @trigger="goToStage(n)"
        />
        <LaunchpadCtrl
            :gate="gate"
            :displayStage="displayStage"
            :subStage="subStage"
            :stageSettings="stageSettings"
            :manual="manual"
            @manualStage="goToStage"
            @toggleManual="toggleManual"
        />
        <Checkbox v-model="manual"/>
  </div>
</template>
<script>
import Stage from './Stage.vue'
import Checkbox from './Checkbox.vue'
import LaunchpadCtrl from './LaunchpadCtrl.vue'
import { MODE_HOLD, MODE_MULTIPLE, MODE_SINGLE, MODE_SILENT } from '../constants.js'

const scale = ['C2', 'D2', 'Eb2', 'E2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3', 'D3', 'Eb3', 'E3', 'F3', 'G3', 'Ab3', 'Bb3']

export default {
    components: {
        Stage,
        LaunchpadCtrl,
        Checkbox
    },

    data () {
        return {
            // sequencer state
            clockTime: 125,
            gateTime: 0.5,
            stage: 0,
            subStage: 0,
            numStages: 8,
            manual: false,
            gate: false,
            stageSettings: [
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
                { active: true, count: 1, value: 0.0, mode: MODE_HOLD },
            ],
            // misc
            destroyed: false
        }
    },

    created () {
        this._interval = setInterval(this.clock, this.clockTime)
    },

    destroy () {
        clearInterval(this._interval)
    },

    computed: {
        // sequencer
        displayStage () {
            return this.stage % 8
        },
        currentStageSettings () {
            return this.stageSettings[this.displayStage]
        },
        skipAll () {
            return this.stageSettings.every(s => !s.active)
        },
        currentNote () {
            const val = this.currentStageSettings.value
            return scale[Math.floor(val * (scale.length - 1))]
        }
    },

    methods: {
        // sequencer
        clock () {
            this.advanceSubstage()
        },
        handleSubstageGate () {
            const count = this.currentStageSettings.count
            const mode = this.currentStageSettings.mode
            const substage = this.subStage
            const isLast = substage === count - 1
            const isFirst = substage === 0

            switch (mode) {
                case MODE_SINGLE:
                    if (isFirst) this.openGate()
                    break
                case MODE_MULTIPLE:
                    this.openGate()
                    break
                case MODE_HOLD:
                    this.openGate(isLast)
                    break
                case MODE_SILENT:
                    break
            }
        },
        toggleManual (manual) {
            this.manual = manual
        },
        openGate (autoOff = true) {
            if (!this.gate) {
                this.$emit('attack', this.currentNote)
            }
            this.gate = true

            clearInterval(this._gateTimeout)
            if (autoOff) {
                this._gateTimeout = setTimeout(() => {
                    if (this.gate != false) {
                        this.$emit('release')
                    }
                    this.gate = false
                }, this.gateTime * this.clockTime)
            }
        },
        goToStage (stage) {
            this.stage = stage
            this.subStage = 0
            if (!this.manual && !this.currentStageSettings.active) {
                return
            }
            this.handleSubstageGate()
        },
        advanceSubstage () {
            const count = this.currentStageSettings.count
            const nextSubstage = this.subStage + 1
            if (nextSubstage >= count) {
                if (!this.manual) {
                    if (this.skipAll) {
                        this.goToStage(0)
                    } else {
                        do {
                            this.advanceStage()
                        } while (!this.currentStageSettings.active)
                    }
                }
            } else {
                this.subStage = nextSubstage
                this.handleSubstageGate()
            }
        },
        advanceStage () {
            const nextStage = this.stage + 1
            this.goToStage(nextStage >= this.numStages ? 0 : nextStage)
        },

        errorHandler () {
            console.log('handle error')
            this.destroyed = true
        }
    }
}
</script>
