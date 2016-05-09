/*eslint-env node*/

import gulp from 'gulp';
import yargs from 'yargs';
import template from 'gulp-template';
import rename from 'gulp-rename';
import foreach from 'gulp-foreach';

import build from './build-tools/build';
import component from './build-tools/generators/component'

gulp.task('build', function(done) {
  process.env.NODE_ENV = yargs.argv.env || 'development';
  build(yargs.argv, done);
});

gulp.task('generate', (done) => {
  var componentName = yargs.argv.component;
  var what = '';
  if (componentName) {
    what = 'component';
  }
  var destinationFolderName = component.data(componentName).componentNameLowerCase;
  var destination = yargs.argv.destination || (destinationFolderName);
  if (what === 'component') {
    // takes component template
    // runs it through lodash templating engine
    // feeding it component name
    // and then creates a copy of processed files
    gulp.src('./build-tools/templates/component/*.tpl')
      .pipe(foreach((stream, _file)=>{
        return stream
        .pipe(template(component.data(componentName)))
        .pipe(rename((path) => {
          path.dirname = destination;
          path.basename = component.fileName(path.basename, componentName);
          path.extname = path.extname.replace('.tpl','');
        }))
        .pipe(gulp.dest('./shared/components'));
      }));
  }
  done();
});
