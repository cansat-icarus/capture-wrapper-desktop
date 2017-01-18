const {dialog, app} = require('electron')
const {window} = require('./main-window')

let cleanup

app.on('before-quit', event => {
	if (!require('./station')() || cleanup === true) {
		console.log('Cleanup done. Quitting...')
		return true
	}

	event.preventDefault()
	console.log('Hold on!')

	if (cleanup instanceof Promise) {
		return console.log('WOULD YOU PLEASE WAIT?!')
	}

	// Let the handler finish executing, run this right after...
	setImmediate(() => {
		console.log('Should I really quit?')

		if (process.env.NODE_ENV === 'dev' && !process.env.NO_QUICK_QUIT) {
			cleanup = true
			app.quit()
		} else {
			dialog.showMessageBox(window, {
				type: 'question',
				title: 'Confirm exit',
				message: 'Are you REALLY sure you want to quit?',
				// Funny way of making the no button bigger
				buttons: ['NOOOOOOO, please no. I beg you. Just get me out.', 'Yes']
			}, choice => {
				if (choice === 1) {
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

exports.cleanup = () => {
	return require('./station')().cleanup()
		.then(() => {
			cleanup = true
		})
}
