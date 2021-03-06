// deps ========================================================================
const fs = require('fs');
const jawn = require('node-jawn');
const _ = require('underscore');

let collector = {
  listFiles (dir, ext) {
    let all = _.map(fs.readdirSync(dir), (item) => dir + '/' + item);
    return _.filter(all, (item) => jawn.getFileExtension(item) === ext.toLowerCase());
  },
  gatherFileNames (dir, ext) {
    return _.map(collector.listFiles(dir, ext), jawn.removeFileExtension);
  },
  getFileContent (list, objMode = false, useBasename = true, baseDir = '') {
    let contents = (objMode ? {} : []);
    _.each(list, (path) => {
      let content = fs.readFileSync(baseDir + path, 'utf-8');
      let basename = useBasename ? jawn.removeFileExtension(jawn.filenameFromPath(path)) : path;
      if (objMode) contents[basename] = content;
      else contents.push(content);
    });
    return contents;
  },
  collect (directory, extension, objMode) {
    return collector.getFileContent(collector.listFiles(directory, extension), objMode);
  }
};

module.exports = collector;
