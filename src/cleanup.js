const isStationCreated = require('./event-handlers')
const { getWindow } = require('./index')
const { dialog, app } = require('electron')

let cleanup

app.on('before-quit', event => {
  if(!isStationCreated() || cleanup === true) {
    console.log('Cleanup done. Quitting...')
    return true
  }

  event.preventDefault()
  console.log('Hold on!')

  if(cleanup instanceof Promise) return console.log('WOULD YOU PLEASE WAIT?!')

  // Let the handler finish executing, run this right after...
  setImmediate(() => {
    console.log('Should I really quit?')

    if(process.env.NODE_ENV === 'dev' && !process.env.NO_QUICK_QUIT) {
      cleanup = true
      app.quit()
    } else {
      dialog.showMessageBox(getWindow(), {
        type: 'question',
        title: 'Confirm exit',
        message: 'Are you REALLY sure you want to quit?',
        // Funny way of making the no button bigger
        buttons: [ 'NOOOOOOO, please no. I beg you. Just get me out.', 'Yes' ]
      }, choice => {
        if(choice === 1) {
          cleanup = require('./station')().cleanup()
            .then(() => {
              // Set cleanup to true (signal doneness) and try quitting again
              cleanup = true
              app.quit()
            })
        }
      })
    }
  })

  return false
})
