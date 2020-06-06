export const formatDate = (date) => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
   return [year, month, day].join('/');
}

// rules not equal
export const filterResult = (originalArray, rules) => {
  const result = [];
   originalArray.forEach(element => {
    if (element.id !== rules.id) {
      result.push(element)
    }
  });
  return result;
}