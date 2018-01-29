<script>
// states
// r - pure red
// R - dim red
// g - pure green
// a - pure amber
// other - off

const SCENE_NOTE = 0
const SCENE_COUNT = 1
const SCENE_MODE = 2

const BLANK_CHAR = '-'

import { midiAccess } from '../midi'

export default {
    render () { return null },
    props: ['stageSettings', 'displayStage', 'gate', 'subStage', 'manual'],

    data () {
        return {
            matrixState: Array.from({length: 8}, x => Array.from({length: 8}, x => false)),
            scene: SCENE_NOTE
        }
    },

    created () {
        this._colReleaseTimeouts = []
        this._colPressTimeouts = []
        midiAccess.then( this.onMIDISuccess, this.onMIDIFailure )
    },

    computed: {
        launchpadState () {
            const state = Array.from({length: 9}, x => {
                return Array.from({length: 9}, x => BLANK_CHAR)
            })

            const stages = this.stageSettings
            const current = this.displayStage
            const gate = this.gate
            const scene = this.scene

            for (let col = 0; col < 8; col++) {
                const stage = stages[col]
                const color = current === col ? (gate ? 'r' : 'R') : 'a'

                if (scene === SCENE_NOTE) {
                    const quant = Math.floor(stage.value * 14)
                    state[8 - (quant >> 1)][col] = color
                    state[8 - ((quant + 1) >> 1)][col] = color
                } else if (scene === SCENE_MODE) {
                    const baseIndex = stage.mode * 2
                    state[baseIndex + 1][col] = color
                    state[baseIndex + 2][col] = color
                } else if (scene === SCENE_COUNT) {
                    const substage = this.subStage
                    const count = stage.count
                    for (let y = 0; y < count; y++) {
                        const color2 = current === col
                            ? (y === substage ? (gate ? 'r' : 'R') : (y > substage ? 'a' : 'R'))
                            : 'a'
                        state[y + 1][col] = color2
                    }
                }

                if (!this.manual) {
                    state[0][col] = stage.active ? 'g' : '-'
                } else {
                    state[0][col] = current === col ? 'r' : '-'
                }
            }

            if (this.manual) {
                state[8][8] = 'r'
            }

            state[scene + 1][8] = 'g'

            return state
        },
        launchpadStateSerialized () {
            return this.launchpadState.map(row => row.join('')).join('\n')
        }
    },

    watch: {
        launchpadState (next, prev) {
            this.sendCommands(this.collectCommands(next, prev))
        }
    },

    methods: {
        collectCommands (next, prev, omitBlanks = false) {
            const diff = []
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    if (y === 0 && x === 8) { continue }

                    const value = next[y][x]
                    if(!prev || value !== prev[y][x]) {
                        if (!omitBlanks || value !== BLANK_CHAR) {
                            diff.push(this.synthesizeCommand(x, y, value))
                        }

                    }
                }
            }
            return diff
        },

        synthesizeCommand(x, y, value) {
            const topRow = y === 0
            const cmd = topRow ? 0xb0 : 0x90
            const key = topRow ? 0x68 + x : 0x10 * (y - 1) + x
            const vel = this.valueVelocity(value)
            return [cmd, key, vel]
        },

        valueVelocity (value) {
            switch (value) {
                case 'r':
                    return 0b001111
                case 'R':
                    return 0b001101
                case 'g':
                    return 0b111100
                case 'a':
                    return 0b111111
                default:
                    return 0b001100
            }
        },

        sendCommands (commands) {
            if (this._currentOutput && this._currentOutput.state === 'connected') {
                commands.forEach(command => {
                    this._currentOutput.send(command)
                })
                if (this._currentOutput.clear) {
                    this._currentOutput.clear()
                }
            }
        },

        onMIDISuccess (midi) {
            midi.outputs.forEach(this.handleOutput)
            midi.inputs.forEach(this.handleInput)

            midi.addEventListener('statechange', (e) => {
                if (e.input) this.handleInput(e.input)
                if (e.output) this.handleOutput(e.output)
            })
        },

        onMIDIFailure () {
            console.error('FAIL')
        },

        handleOutput (output) {
            if (output.name === 'Launchpad Mini') {
                this.cleanupMidiOutput()
                this._currentOutput = output
                output.send([ 0xb0, 0x00, 0 ])
                output.send([ 0xb0, 0x00, 0b100001 ])
                this.sendCommands(this.collectCommands(this.launchpadState, null, true))
            }
        },

        handleInput (input) {
            if (input.name === 'Launchpad Mini') {
                this.cleanupMidiInput()
                this._currentInput = input
                input.addEventListener('midimessage', this.onMidiMessage)
            }
        },

        cleanupMidiInput () {
            if (this._currentInput) {
                this._currentInput.removeEventListener('midimessage', this.onMidiMessage)
            }
            this._currentInput = null
        },
        cleanupMidiOutput () {
            if (this._currentOutput) {
                // this._currentOutput.removeEventListener('midimessage', this.onMidiMessage)
            }
            this._currentOutput = null
        },

        beforeDestroy () {
            this.cleanupMidiInput()
            this.cleanupMidiOutput()
        },

        onMidiMessage (msg) {
            const [code, key, vel] = msg.data
            const press = vel > 0

            if (code === 0x90) {
                const x = key & 0xF
                const y = (key & ~0xF) >> 4

                if (x === 8) {
                    if (press) this.onSidePress(y)
                    else this.onSideRelease(y)
                } else {
                    if (press) this.onMatrixPress(x, y)
                    else this.onMatrixRelease(x, y)
                }
            } else if (code === 0xb0) {
                if (press) this.onUpperPress(key - 0x68)
                else this.onUpperRelease(key - 0x68)
            }
        },

        onMatrixPress (x, y) {
            this.matrixState[x][y] = true
            const scene = this.scene
            if (scene === SCENE_NOTE) {
                const up = y > 0 && this.matrixState[x][y - 1] === true
                const down = y < 7 && this.matrixState[x][y + 1] === true

                const baseValue = y * 2
                const bias = (down ? -1 : 0) + (up ? 1 : 0)

                const finalValue = (14 - baseValue + bias) / 14

                clearTimeout(this._colPressTimeouts[x])
                this._colPressTimeouts[x] = setTimeout(
                    () => this.stageSettings[x].value = finalValue
                , 20)
            } else if (scene === SCENE_MODE) {
                this.stageSettings[x].mode = Math.floor((y) / 2)
            } else if (scene === SCENE_COUNT) {
                this.stageSettings[x].count = y + 1
            }
        },

        onMatrixRelease (x, y) {
            this.matrixState[x][y] = false
            const scene = this.scene
            if (scene === SCENE_NOTE) {
                const up = y > 0 && this.matrixState[x][y - 1] === true
                const down = y < 7 && this.matrixState[x][y + 1] === true

                clearTimeout(this._colReleaseTimeouts[x])

                if (up || down && (!up || !down)) {
                    const baseValue = y * 2
                    const bias = (down ? -2 : 0) + (up ? 2 : 0)
                    const finalValue = (14 - baseValue + bias) / 14
                    this._colReleaseTimeouts[x] = setTimeout(
                        () => this.stageSettings[x].value = finalValue
                    , 30)
                }
            }
        },

        onUpperPress (keyNum) {
            if (this.manual) {
                this.$emit('manualStage', keyNum)
            } else {
                this.stageSettings[keyNum].active = !this.stageSettings[keyNum].active
            }
        },

        onUpperRelease (keyNum) {
        },

        onSidePress (keyNum) {
            if (keyNum === 0) this.scene = SCENE_NOTE
            if (keyNum === 1) this.scene = SCENE_COUNT
            if (keyNum === 2) this.scene = SCENE_MODE
            if (keyNum === 7) {
                this.$emit('toggleManual', !this.manual)
            }
        },

        onSideRelease (keyNum) {
        }
    }
}
</script>
