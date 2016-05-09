# videogular-vimeo
Vimeo plugin for videogular player

## Bower Installation
```sh
bower install videogular-vimeo
```

## NPM Installation
```sh
npm install videogular-vimeo
```

## Example usage:

In order to add support for Vimeo videos to Videogular, simply add the `vg-vimeo` attribute to the `vg-media` element.

```html
<videogular vg-theme="controller.config.theme">
    <vg-media vg-vimeo vg-src="controller.config.sources"></vg-media>
</videogular>
```
```html
<script src="bower_components/vimeo-jquery-api/dist/jquery.vimeo.api.min.js"></script>
<script src="bower_components/videogular-vimeo/dist/vg-vimeo.min.js"></script>
```