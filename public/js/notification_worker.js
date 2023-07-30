import {Pocketbase }  from 'https://unpkg.com/pocketbase@0.15.3/dist/pocketbase.cjs.js'
const pb = new Pocketbase('https://postr.pockethost.io')
pb.autoCancellation(false)
pb.collection('notifications').subscribe('*', (data) => {
    console.log(data)
})

console.log('hello world')