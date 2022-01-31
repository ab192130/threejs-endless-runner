import Application from './bin/app.js'

window.application = new Application({
    canvas: document.querySelector('#app'),
    useComposer: true
})
