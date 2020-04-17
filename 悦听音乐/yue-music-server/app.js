const express = require('express')
const compression = require('compression')
const app = express()

app.use(compression()) // 这行代码必须在前面
app.use(express.static('./dist'))

app.listen(80, () => {
  console.log('server running at http://127.0.0.1')
})