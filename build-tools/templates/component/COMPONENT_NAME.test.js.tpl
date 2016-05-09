/*global describe it expect console*/

import TestUtils from 'react-addons-test-utils';
import React from 'react';

import <%= componentNameCamelCase %> from './<%= componentNameLowerCase %>.component';

describe('<%= componentNameCamelCase %> component', ()=>{
  it('renders without problems', (done)=>{
      <%= componentNameLowerCase %> = TestUtils.renderIntoDocument(React.createElement(<%= componentNameCamelCase %>) );
      expect(<%= componentNameLowerCase %>.state).toEqual({});
      done();
  });
});
