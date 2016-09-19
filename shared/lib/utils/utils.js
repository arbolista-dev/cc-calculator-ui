import jwtDecode from 'jwt-decode';

function tokenIsValid(token){
  return jwtDecode(token).exp < new Date().getTime();
}

function validateParameter(parameter) {
  let key = Object.keys(parameter)[0],
      value = Object.values(parameter)[0],
      re;
  switch (key) {
    case "first_name":
      re = /^[A-Za-z0-9 ]{4,20}$/;
      break;
    case "last_name":
      re = /^[A-Za-z0-9 ]{4,20}$/;
      break;
    case "email":
      re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      break;
    case "password":
      re = /^[A-Za-z0-9!@#$%^&*()_]{4,30}$/;
      break;
    default:
      break;
  }
  return re.test(value);
}

function getLocalStorageItem(specifier) {
  try {
    if (specifier !== 'take_action'){
      let item = localStorage.getItem(specifier);
      if (item) {
        return JSON.parse(item);
      } else {
        return false;
      }
    } else {
      let results = {
          dollars: localStorage.getItem('result_takeaction_dollars'),
          net10yr: localStorage.getItem('result_takeaction_net10yr'),
          pounds: localStorage.getItem('result_takeaction_pounds')
        },
        results_exist = Object.values(results).filter(result => result != null);

      if(results_exist.length !== 0){
        return results;
      } else {
        return false;
      }
    }
  } catch (err) {
    console.log('getLocalStorageItem err', err);
    return false;
  }
}

function setLocalStorageItem(specifier, data) {
  try {
    console.log('setLocalStorageItem id', specifier);
    console.log('setLocalStorageItem data', data);
    localStorage.setItem(specifier, JSON.stringify(data));
  } catch (err) {
    console.log('setLocalStorageItem error', err);
  }
}


export { tokenIsValid, validateParameter, getLocalStorageItem, setLocalStorageItem };
