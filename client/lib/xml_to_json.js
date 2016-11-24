export default function xmlToJson(xml) {
  // Create the return object
  let obj;
  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj = {};
      obj['@attributes'] = {};
      for (let j = 0; j < xml.attributes.length; j += 1) {
        const attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // text
    return xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    if (xml.childNodes && xml.childNodes[0].nodeType === 3) {
      return xml.childNodes[0].nodeValue;
    }
    obj = obj || {};
    for (let i = 0; i < xml.childNodes.length; i += 1) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;

      if (typeof (obj[nodeName]) === 'undefined') {
        if (item.nodeType === 3) {
          obj[nodeName] = item.nodeValue;
        } else {
          const res = xmlToJson(item);
          obj[nodeName] = res;
        }
      } else {
        if (typeof (obj[nodeName].push) === 'undefined') {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}
