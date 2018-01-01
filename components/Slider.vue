<template>
    <div class="slider" @mousedown.prevent="click" ref="slider">
        <div class="handle" @mousedown.prevent.stop="startDrag" :class="{active}" :style="style"></div>
    </div>
</template>
<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number,
            required: true
        }
    },
    computed: {
        position () {
            return Math.max(0, Math.min(1, this.value))
        },
        style () {
            const absPos = (1 - this.position) * (240 - 24)
            return {
                transform: `translate(0, ${absPos}px)`
            }

        }
    },

    methods: {
        click (event) {
            const rect = this.$refs.slider.getBoundingClientRect()
            const posY = event.pageY
            const newVal = Math.max(0, Math.min(1, 1 - ((posY - rect.top) / rect.height)))
            this.$emit('input', newVal)
            this._startY = event.pageY
            this._startVal = newVal
            document.addEventListener('mousemove', this.dragMove)
            document.addEventListener('mouseup', this.stopDrag)
        },
        startDrag (event) {
            this._startY = event.pageY
            this._startVal = this.value
            document.addEventListener('mousemove', this.dragMove)
            document.addEventListener('mouseup', this.stopDrag)
        },
        dragMove (event) {
            event.preventDefault()
            const rect = this.$refs.slider.getBoundingClientRect()
            const deltaY = event.pageY - this._startY
            const deltaV = -(deltaY / rect.height)
            const newVal = Math.max(0, Math.min(1, this._startVal + deltaV))
            this.$emit('input', newVal)
        },
        stopDrag () {
            event.preventDefault()
            document.removeEventListener('mousemove', this.dragMove)
            document.removeEventListener('mouseup', this.stopDrag)
        }
    }
}
</script>
<style scoped>
    .slider {
        height: 240px;
        width: 24px;
        background: #abc;
    }

    .handle {
        height: 24px;
        background: #678;
    }

    .active {
        background: #943;
    }
</style>
