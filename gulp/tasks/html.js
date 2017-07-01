'use strict';

module.exports = function () {
    function getBlocksObj (file) {
        Array.isArray($.blocksObj[file.stem]) ? $.blocksObj[file.stem].splice(0, $.blocksObj[file.stem].length) : $.blocksObj[file.stem] = [];

        require('get-classes-from-html')(file.contents.toString()).forEach(function (className, i, arr) {
            ($.blocksObj[file.stem].indexOf(className) === -1) && (className.indexOf('__') === -1)
            && (className.indexOf('_') === -1) && $.blocksObj[file.stem].push(className);
        });

        return file;
    }

    $.gulp.task('html', $.gulp.series(
        function getHtml () {
            return $.combiner(
                $.gulp.src(['sources/pages/**/*.pug']),
                $.gp.if($.isWatch, $.emittyPug.stream($.emittyChangedFile)),
                $.gp.pug({
                    locals: {
                        package: $.package,
                        faviconCode: $.faviconData.favicon.html_code,
                        isDevelopment: $.isDevelopment
                    }
                }),
                $.gp.posthtml([
                    require('posthtml-bem-sugar')({
                        blockPrefix: '-',
                        elemPrefix: '__',
                        modPrefix: '_',
                        modDlmtr: '_'
                    }),
                    require('posthtml-bem')({
                        elemPrefix: '__',
                        modPrefix: '_',
                        modDlmtr: '_'
                    })
                ]),
                $.gp.rename(function (path) {
                    path.extname = ".html"
                }),
                $.map(function (file, cb) {cb(null, getBlocksObj(file))}),
                $.gp.htmlBeautify({indent_size: 2}),
                $.gp.debug({title: 'DEBUG "html": '}),
                $.gulp.dest('build/')
            ).on('error', $.gp.notify.onError(function(err) {
                return {
                    title: 'ERROR "html": ',
                    message: err.message
                }
            }));
        },
        function getBlocksArr (done) {
            $.blocksArr.splice(0, $.blocksArr.length);
            for (var prop in $.blocksObj) if ($.blocksObj.hasOwnProperty(prop)){
                $.blocksObj[prop].forEach(function (className) {
                    ($.blocksArr.indexOf('sources/blocks/' + className) === -1) && $.blocksArr.push('sources/blocks/' + className);
                });
            }
            //console.log($.blocksObj);
            console.log($.blocksArr);
            done();
        }
    ));
};