<template>
    <div layout="column u2">
        <Slider
            :active="active"
            v-model="stage.value"
        />
        <DiscreteSlider v-model="stage.count" :options="[1,2,3,4,5,6,7,8]"/>
        <DiscreteSlider v-model="stage.mode" :options="modeOptions"/>
        <Checkbox @input="handleStageButton" :value="stageButtonValue"/>
    </div>
</template>
<script>
import Slider from './Slider.vue'
import DiscreteSlider from './DiscreteSlider.vue'
import Checkbox from './Checkbox.vue'
import { MODE_SINGLE, MODE_MULTIPLE, MODE_HOLD, MODE_SILENT } from '../constants'

const modeOptions = [
    { value: MODE_HOLD, label: '●' },
    { value: MODE_MULTIPLE, label: '◍' },
    { value: MODE_SINGLE, label: '◖' },
    { value: MODE_SILENT, label: '○' },
]

export default {
    components: {
        Slider,
        DiscreteSlider,
        Checkbox,
    },
    props: {
        active: {
            type: Boolean,
            required: true
        },
        stage: {
            type: Object,
            required: true
        },
        manual: {
            type: Boolean,
            required: false
        }
    },
    computed: {
        modeOptions: () => modeOptions,
        stageButtonValue () {
            return this.manual ? this.active : this.stage.active
        }
    },
    methods: {
        handleStageButton () {
            if (this.manual) {
                this.$emit('trigger')
            } else {
                stage.active = !stage.active
            }
        }
    }
}
</script>
