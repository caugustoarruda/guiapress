const express = require("express");
const router = express.Router();

router.get('/articles', (req, res) => {
    res.send("Hello from articles!")
});

module.exports = router