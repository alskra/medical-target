'use strict';

module.exports = function () {
    $.gulp.task('reloadGlobal', function() {
        return $.gulp.src('build/**/*.html', {since: $.gulp.lastRun('reloadGlobal')})
            .pipe($.browserSync.reload({stream: true}));
    });

    $.gulp.task('watch', function() {
        $.isWatch = true;

        //html
        $.gulp.watch('sources/**/*.pug', $.gulp.series('html', 'img', $.gulp.parallel('css.blocks', 'js.blocks'), 'reloadGlobal'))
            .on('all', function(event, filepath) {
                $.emittyChangedFile = filepath;
            });

        //css.components
        $.gulp.watch([$.paths.cssComponents, JSON.parse($.fs.readFileSync($.paths.cssComponents)), 'sources/components/**/*.{css,styl}', 'sources/static/**/*.{css,styl}'], $.gulp.series('css.components', function reloadCssComponents(done) {
            $.browserSync.reload('build/static/css/components.css'); done();
        }));

        //css.blocks
        $.gulp.watch(['sources/components/bootstrap/css/{variables,mixins}.styl', 'sources/blocks/**/*.styl'], $.gulp.series('css.blocks', function reloadCssBlocks(done) {
            $.browserSync.reload('build/static/css/blocks.css'); done();
        })).on('all', function (event, filepath) {
            if (event === 'deleted') { // if a file is deleted, forget about it
                delete $.gp.cached.caches['stylus'][$.path.resolve(filepath)];
                $.gp.remember.forget('stylus', $.path.resolve(filepath));
            }
            $.stylusChangedFile = $.path.resolve(filepath); //console.log(event);console.log(event.type);console.log(event.path);console.log(filepath);
        });

        //js.components
        $.gulp.watch([$.paths.jsComponents, 'sources/components/**/*.js'], $.gulp.series('js.components', function reloadJsComponents(done) {
            $.browserSync.reload('build/static/js/blocks.js'); done();
        }));

        //js.blocks
        $.gulp.watch(['sources/blocks/**/*.js'], $.gulp.series('js.blocks', function reloadJsBlocks(done) {
            $.browserSync.reload('build/static/js/blocks.js'); done();
        }));

        //img
        $.gulp.watch(['sources/static/img/content/**/*.{png,jp*g,gif,svg}', 'sources/blocks/**/*.{png,jp*g,gif,svg}'], $.gulp.series('img', function reloadImg(done) {
            $.browserSync.reload('build/static/img/**/*.{png,jp*g,gif,svg}'); done();
        }));

        //fonts
        $.gulp.watch([$.paths.fonts], $.gulp.series('fonts'));

        //glyphicons
        $.gulp.watch(['sources/static/fonts/glyphicons/icons/*.svg'], $.gulp.series('glyphicons'));

        //misc
        $.gulp.watch(['sources/static/misc/**/*.*'], $.gulp.series('misc'));
    });
};