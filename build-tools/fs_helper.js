/*global Promise console*/

import fs from 'fs';
import path from 'path';
import ncp from 'ncp';

class FsHelper {

  // traverse directory and return array of all its file names.
  // http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
  static walk(dir) {
    var results = [];
    return new Promise((fnResolve, fnReject)=>{
      fs.readdir(dir, function(err, list) {
        if (err){
          console.error('=== FsHelper.walk Error ===')
          console.error(err);
          return fnReject();
        }
        var i = 0;
        (function next() {
          var file = list[i++];
          if (!file) return fnResolve(results);
          file = path.resolve(dir, file);
          fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              FsHelper.walk(file)
                .then((res)=>{
                  results = results.concat(res);
                  next();
                })
            } else {
              results.push(file);
              next();
            }
          });
        })();
      });
    })
  }

  // remove directory and all of its contents.
  static rmDir(dir_path, opts) {
    opts = Object.assign({
      except: []
    }, opts || {});
    return new Promise((fnResolve, fnReject)=>{
      fs.readdir(dir_path, function(err, files) {
        if(err) {
          console.error('=== FsHelper.rmDir Error ===')
          console.error(err)
          return fnReject();
        }
        var wait = files.length,
            count = 0,
            folderDone = function(err) {
              count++;
              // If we cleaned out all the files, continue
              if( count >= wait || err) {
                fs.rmdir(dir_path, fnResolve);
              }
            };
        // Empty directory to bail early
        if(!wait) {
          folderDone();
          return;
        }

        // Remove one or more trailing slash to keep from doubling up
        dir_path = dir_path.replace(/\/+$/,'');
        files.forEach(function(file) {
          var curPath = dir_path + '/' + file;
          fs.lstat(curPath, function(err, stats) {
            if( err ) {
              fnReject(err);
              return;
            }
            if (opts.except.indexOf(path.normalize(curPath)) >= 0){
              folderDone();
            } else if( stats.isDirectory() ) {
              FsHelper.rmDir(curPath, opts)
                .then(folderDone);
            } else {
              fs.unlink(curPath, folderDone);
            }
          });
        });
      });
    });
  }

  static copy(source, dest, opts){
    opts = Object.assign({
      stopOnError: true
    }, opts || {});

    if (opts && opts.ext){
      opts.filter = function(source){
        let stats = fs.statSync(source)
        if (stats.isDirectory()){
          return true;
        } else if (opts.ext.test(source)){
          return true
        }
        return false;
      }
    }

    return new Promise((fnResolve, fnReject)=>{
      ncp.ncp(source, dest, opts, (err)=>{
        if (err){
          console.error('=== FsHelper.copy Error ===');
          return fnReject(err);
        }
        fnResolve();
      });
    });
  }

  // Promise wrapper for fs.writeFile
  static writeFile(dest, content){
    return new Promise((fnResolve, fnReject)=>{
      let dest_dir = path.dirname(dest)
      FsHelper.mkDir(dest_dir).then(()=>{
        fs.writeFile(dest, content, (err)=>{
          if (err){
            console.error('=== FsHelper.writeFile Error ===');
            console.error(err);
            return fnReject();
          }
          fnResolve();
        });
      })
    });
  }

}

export default FsHelper;
