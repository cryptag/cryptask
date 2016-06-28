# CrypTask

This is a desktop app made with electron and React.js that is designed
as a simple UI wrapper that talks to a local server/API/daemon
`cryptagd` which is provided by
[CrypTag](https://github.com/elimisteve/cryptag).

## Pre-requisites

Install `cryptask-sandstorm` to create and store tasks and store them
in [Sandstorm](https://sandstorm.io/) (once you install
[the CrypTag Sandstorm app](https://apps.sandstorm.io/app/mkq3a9jyu6tqvzf7ayqwg620q95p438ajs02j0yx50w2aav4zra0)
).

### cryptask-sandstorm

Make sure you have Go installed, then run:

    $ go get github.com/elimisteve/cryptag/cmd/cryptask-sandstorm
    $ cryptask-sandstorm init <sandstorm_webkey>

To generate a Sandstorm webkey,
[install this](https://apps.sandstorm.io/app/mkq3a9jyu6tqvzf7ayqwg620q95p438ajs02j0yx50w2aav4zra0)
then _click the key icon_ near the top of your screen.

If someone else gave you the Sandstorm webkey along with the decrypt
key needed to access the tasks s/he is sharing with you, also run

    $ cryptask-sandstorm setkey <key>

For more on getting started with `cryptask-sandstorm`, including how
to store and fetch tasks at the command line, simply run

    $ cryptask-sandstorm

### cryptagd

Install the local daemon `cryptagd` that CrypTask talks to:

    $ go get github.com/elimisteve/cryptag/servers/cryptagd

Run it in one terminal with

    $ cryptagd

meanwhile, in another terminal, run CrypTask (see next section).

## Installation and Running

``` $ npm install ```

then

``` $ npm start ```

## Testing

There are some placeholder tests included here that test the rendering of the individual components
and the final compiled version of the app. You'll need to build the app first:

``` $ npm run build ```

If you're on Linux, instead run:

``` $ npm run build-linux ```

(TODO: automate this based on system platform detection.)

``` $ npm test ```

## Thank Yous

_Major_ thanks to [@jimmcgaw](https://github.com/jimmcgaw) for writing
the foundations to this app, which began as a clone of
[jimmcgaw/cpassui@d072b0f](https://github.com/jimmcgaw/cpassui/commit/d072b0fa8d9c2442a094cae98bf2acafb28154f3).
