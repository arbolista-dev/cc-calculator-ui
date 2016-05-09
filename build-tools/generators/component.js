import * as S from 'underscore.string';

function templateData(componentName) {
  return {
    componentNameLowerCase: S.underscored(componentName),
    componentNameCamelCase: S.classify(componentName)
  };
}

function translateFileName(fileName, componentName) {
  return S.replaceAll(fileName, 'COMPONENT_NAME',
    S.underscored(componentName));
}


export default {
  data: templateData,
  fileName: translateFileName
};
