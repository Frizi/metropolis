<template>
  <div layout="row u3">
        <Stage v-for="(s, n) in stageSettings" :key="n" :stage="s" :active="gate && n === displayStage"/>

  </div>
</template>
<script>
import Stage from './Stage.vue'
import { MODE_SINGLE, MODE_MULTIPLE, MODE_HOLD, MODE_SILENT } from '../constants.js'

const scale = ['C3', 'D3', 'E#3', 'F3', 'G3', 'A#3', 'B#3']

export default {
    components: {
        Stage
    },

    data () {
        return {
            // sequencer state
            clockTime: 125,
            gateTime: 0.5,
            stage: 0,
            subStage: 0,
            numStages: 8,
            gate: false,
            stageSettings: [
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
                { active: true, count: 1, value: 0.0, mode: MODE_SINGLE },
            ],
            // misc
            destroyed: false
        }
    },

    created () {
        this._interval = setInterval(this.clock, this.clockTime)
    },

    mounted () {
        this.requestFrame()
    },

    destroy () {
        clearInterval(this._interval)
    },

    computed: {
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
            return scale[Math.floor(val * scale.length)]
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
            if (!this.currentStageSettings.active) {
                return
            }
            this.handleSubstageGate()
        },
        advanceSubstage () {
            const count = this.currentStageSettings.count
            const nextSubstage = this.subStage + 1
            if (nextSubstage >= count) {
                if (this.skipAll) {
                    this.goToStage(0)
                } else {
                    do {
                        this.advanceStage()
                    } while (!this.currentStageSettings.active)
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

        // drawing
        // tick (time) {
        //     for (let i in this.stageSettings) {
        //         this.stageSettings[i].value = (Math.sin(time * 0.001 + i * 0.3) + 1) * 0.5
        //     }
        // },

        // frame (time) {
        //     if (!this.destroyed) {
        //         this.tick(time)
        //         this.requestFrame()
        //     }
        // },

        // requestFrame () {
        //     requestAnimationFrame(this.frame)
        // },

        errorHandler () {
            console.log('handle error')
            this.destroyed = true
        }
    }
}
</script>
