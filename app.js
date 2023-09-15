const express = require('express')
const request = require('request')
const app = express()
const port = 3000

app.get('/bundles/user/:userId', (req, res) => {
	const userId = req.params.userId
	const { limit, cursor } = req.query

	const url = `https://catalog.roblox.com/v1/users/${userId}/bundles?limit=${limit}&sortOrder=Asc`
	if (cursor) url += `&cursor=${cursor}`
	request(url, (err, response, body) => {
		if (err) {
			return res.status(500).send(err)
		}
		res.send(body)
	})
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})