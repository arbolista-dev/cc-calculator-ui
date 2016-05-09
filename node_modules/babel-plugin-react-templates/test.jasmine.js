import Jasmine from 'jasmine'

var jasmine = new Jasmine()
jasmine.loadConfig({
  spec_dir: 'test',
  spec_files: [
      '**/*.test.js'
  ]
});
jasmine.execute();
