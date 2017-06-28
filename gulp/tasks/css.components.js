'use strict';

module.exports = function () {
    $.gulp.task('css.components', function () {
        const filterStyl = $.gp.filter('**/*.styl', {restore: true});
        return $.combiner(
            $.gulp.src(JSON.parse($.fs.readFileSync($.paths.cssComponents)))
                .on('data', function (file) {
                    file.dirname = file.cwd;
                    //console.log(file.relative);
                }),
            $.gp.sourcemaps.init(),
            filterStyl,
            $.gp.stylus({
                'include css': true,
                import: ['sources/components/bootstrap/css/variables.styl', 'sources/components/bootstrap/css/mixins.styl'],
                use: [$.autoprefixerStylus($.config.autoprefixer)]
            }),
            filterStyl.restore,
            $.gp.concat({path: 'components.css'}),
            $.gp.sourcemaps.write(),
            $.gp.debug({title: 'DEBUG "css.components": '}),
            $.gulp.dest('build/static/css/')
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "css.components": ',
                message: err.message
            }
        }));
    });
};