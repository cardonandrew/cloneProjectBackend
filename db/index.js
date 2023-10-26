module.exports = {
  ...require("./client"),
  ...require("./users"), // adds key/values from users.js
  ...require("./posts"), // adds key/values from products.js
  // ...require("./comments"),
};
