const getCurrentDate = () => {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
  
    return `${dd}.${mm}.${yyyy}`;
  };
  
  const getWeekDay = () => {
    let today = new Date();
    let day = today.getDay();
  
    switch (day) {
      case 0:
        return "Sonntag";
      case 1:
        return "Montag";
      case 2:
        return "Dienstag";
      case 3:
        return "Mittwoch";
      case 4:
        return "Donnerstag";
      case 5:
        return "Freitag";
      case 6:
        return "Samstag";
    }
  };
  
  export { getCurrentDate, getWeekDay };
  