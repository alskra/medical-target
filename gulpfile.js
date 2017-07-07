'use strict';

global.$ = {
    package: require('./package.json'),
    config: require('./gulp/config.js'),
    paths: {
        tasks: require('./gulp/paths/tasks.js'),
        cssComponents: './gulp/paths/css.components.json',
        jsComponents: './gulp/paths/js.components.json',
        fonts: './gulp/paths/fonts.json'
    },
    gulp: require('gulp'),
    gp: require('gulp-load-plugins')(),
    combiner: require('stream-combiner2').obj,
    del: require('del'),
    browserSync: require('browser-sync').create(),
    emittyPug: require('emitty').setup('sources', 'pug'),
    map: require('map-stream'),
    fs: require('fs'),
    autoprefixerStylus: require('autoprefixer-stylus'),
    path: require('path'),

    blocksObj: {},
    blocksArr: [],

    emittyChangedFile: '',
    stylusChangedFile: '',

    isDevelopment: process.env.NODE_ENV !== 'production',
    isWatch: false
};

$.paths.tasks.forEach(function(taskPath) {
    require(taskPath)();
});