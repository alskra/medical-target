'use strict';

module.exports = function () {
    $.gulp.task('generate-favicon', function(done) {
        $.gp.realFavicon.generateFavicon({
            masterPicture: $.config.favicon.masterPicture,
            dest: 'build/favicon/',
            iconsPath: '/favicon/',
            design: $.config.favicon.design,
            settings: {
                scalingAlgorithm: 'Mitchell',
                errorOnImageTooSmall: false
            },
            markupFile: $.config.favicon.markupFile
        }, function() {
            done();
        });
    });
};