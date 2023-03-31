const express = require("express");
const router = express.Router();

// Validate the email address
router.get("/", async (req, res) => {
  // this is how you query the url
  console.log("I was called");
  console.log(req.query.token);
});

module.exports = router;
