const getNonSensitiveFields = (fieldsToIgnore,data) =>{


  const nonSensitiveUserData = Object.fromEntries(
    Object.entries(data).filter(
      (item) => !fieldsToIgnore.includes(item[0])
    )
  );

  return nonSensitiveUserData


}



module.exports = getNonSensitiveFields