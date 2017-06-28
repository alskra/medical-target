'use strict';

module.exports = function () {
    $.gulp.task('generate-favicon', function(done) {
        $.gp.realFavicon.generateFavicon({
            masterPicture: 'sources/static/favicon/like.svg',
            dest: 'build/favicon/',
            iconsPath: '/favicon/',
            design: $.config.favicon.design,
            settings: {
                scalingAlgorithm: 'Mitchell',
                errorOnImageTooSmall: false
            },
            markupFile: $.paths.favicon
        }, function() {
            done();
        });
    });
};