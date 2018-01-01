import Vue from 'vue'
import App from './components/App'
import './layout.scss'

Vue.config.errorHandler = function (err, vm, info)  {
    let handler, current = vm
    if (vm.$options.errorHandler) {
        handler = vm.$options.errorHandler
    } else {
        while (current.$parent) {
            current = current.$parent
            if (handler = current.$options.errorHandler) break
        }
    }
    if (handler) handler.call(current, err, vm, info)
    else console.log(err)
}

new Vue({
    el: '#app',
    render: (h) => h(App)
})
