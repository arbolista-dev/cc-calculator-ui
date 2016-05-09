import React from 'react';
import _ from 'lodash';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

import Component1 from './fixtures/component1';

describe('Component1 fixed', ()=>{

  // component1 uses require, component2 (nested) users import
	it('renders itself and nested component', (done)=>{
		var component1 = React.createFactory(Component1),
			result = ReactDOMServer.renderToStaticMarkup(component1({prop1: 'yada'}));
    fs.readFile(__dirname + '/fixtures/expected.html', 'utf8', (err, expected)=>{
      if (err){
        console.error(err)
        expect(true).toEqual(false);
        return done();
      }
      expect(result).toEqual(_.trim(expected));
      done();
    })
	});
});

