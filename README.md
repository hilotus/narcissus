# Narcissus

This README outlines the details of collaborating on this Ember application.

A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM) and [Bower](http://bower.io/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at http://localhost:4200.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

* Use [capistrano](https://github.com/capistrano/capistrano) to deploy the app.

```
1. make sure you have install ruby
2. bundle install
3. bundle exec cap production deploy
```

### Adapter & Store & Ajax
* if we customer a ajax, we should use in adapters/application.js, maybe also change the store logics, another
* files don't need to change.

### Add PushPlugin in cordova
* PushPlugin: https://github.com/hilotus/PushPlugin
* add baidu push for android instead of gcm in china.

```bash
cordova plugin add 'https://github.com/hilotus/PushPlugin.git'
```

## TODO List

## ISSUE List

1. css confusion on firefox..
