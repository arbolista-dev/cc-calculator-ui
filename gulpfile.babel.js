import gulp from 'gulp';
import yargs from 'yargs';
import template from 'gulp-template';
import rename from 'gulp-rename';
import foreach from 'gulp-foreach';

import build from './build-tools/build';
import component from './build-tools/generators/component';

gulp.task('build', (done) => {
  process.env.NODE_ENV = yargs.argv.env || 'development';
  build(yargs.argv, done);
});

gulp.task('generate', (done) => {
  const componentName = yargs.argv.component;
  let what = '';
  if (componentName) {
    what = 'component';
  }
  const destinationFolderName = component.data(componentName).componentNameLowerCase;
  const destination = yargs.argv.destination || (destinationFolderName);
  if (what === 'component') {
    // takes component template
    // runs it through lodash templating engine
    // feeding it component name
    // and then creates a copy of processed files
    gulp.src('./build-tools/templates/component/*.tpl')
      .pipe(foreach(stream => stream
        .pipe(template(component.data(componentName)))
        .pipe(rename((p) => {
          const path = p;
          path.dirname = destination;
          path.basename = component.fileName(path.basename, componentName);
          path.extname = path.extname.replace('.tpl', '');
        }))
        .pipe(gulp.dest('./shared/components'))));
  }
  done();
});
