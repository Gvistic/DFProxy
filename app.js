import express from 'express'
import request from 'request'
const app = express()
const port = 5001

app.get('/bundles/user/:userId', (req, res) => {
	const userId = req.params.userId
	const { limit, cursor } = req.query

	const url = `https://catalog.roproxy.com/v1/users/${userId}/bundles?limit=${limit}&sortOrder=Asc`
	if (cursor) url += `&cursor=${cursor}`
	request(url, (err, response, body) => {
		if (err) {
			return res.status(500).send(err)
		}
		res.send(body)
	})
})

app.get('/', (_req, res) => {
	res.send('Hello World!')
})

app.listen(port, '0.0.0.0', () => {
	console.log(`App listening on port ${port}`)
});
  