<template>
    <div class="slider">
        <div
            v-for="(opt, n) in options"
            :key="n"
            class="handle"
            :class="{selected: value === optionValue(opt)}"
            @click="$emit('input', optionValue(opt))"
            layout="row center middle"
        >
            <span>{{optionLabel(opt)}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        options: {
            type: Array,
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    },
    methods: {
        optionValue (opt) {
            if (typeof opt === 'object') return opt.value
            return opt
        },
        optionLabel (opt) {
            if (typeof opt === 'object') return opt.label
            return opt
        }
    }

}
</script>
<style scoped>
    .slider {
        width: 24px;
        background: #abc;
        color: black;
    }

    .handle {
        height: 24px;
    }

    .selected {
        color: white;
        background: #234;
    }
</style>
