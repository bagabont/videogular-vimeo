'use strict';

angular.module('myApp',
    [
        'ngSanitize',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'videogular.plugins.vimeo'
    ]
    )
    .controller('HomeCtrl',
        ['$sce', function ($sce) {
            this.config = {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl('https://vimeo.com/channels/staffpicks/156412748')
                    }],
                theme: 'bower_components/videogular-themes-default/videogular.css'
            };
        }]
    );