//Generates a GUID
var crypto = require("crypto");

function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = crypto.randomBytes(1)[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

function generateUniqueGUID(listOfIds) {
    if (listOfIds === undefined) {
        listOfIds = [];
    }
    var uniqueId = generateGUID();
    if (listOfIds.indexOf(uniqueId) > -1) {
        return generateUniqueGUID();
    } else {
        return uniqueId;
    }
}

module.exports = generateUniqueGUID;