export default function xmlToJson(xml) {
  // Create the return object
  var obj = undefined;
  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj = {};
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    return xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    if (xml.childNodes && xml.childNodes[0].nodeType === 3){
      return xml.childNodes[0].nodeValue;
    } else {
      obj = obj || {};
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;

        if (typeof(obj[nodeName]) == "undefined") {
          if (item.nodeType === 3){
            obj[nodeName] = item.nodeValue
          } else {
            let res = xmlToJson(item);
            obj[nodeName] = res
          }
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));

        }
      }
    }
  }
  return obj;
}
