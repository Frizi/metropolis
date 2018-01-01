<template>
    <div class="handle" :class="{active: !!value}" @click="$emit('input', !value)"></div>
</template>
<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true
        }
    }
}
</script>
<style scoped>
    .handle {
        width: 24px;
        height: 24px;
        background: #678;
    }

    .active {
        background: #943;
    }
</style>
