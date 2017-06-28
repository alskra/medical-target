'use strict';

module.exports = function () {
    $.gulp.task('server', function() {
        $.browserSync.init({
            server: {
                baseDir: 'build/'
            },
            tunnel: true,
            host: 'localhost',
            port: 3000,
            logPrefix: 'AlSKra'
        });

        //$.browserSync.watch('build/**/*.*').on('change', $.browserSync.reload);
    });
};