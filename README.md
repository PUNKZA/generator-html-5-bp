# generator-html-5-bp [![NPM version][npm-image]][npm-url]
> A simple html5 & grunt setup for front end web development


## Installation

First, install [Yeoman](http://yeoman.io) and generator-html-5-bp using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
$ npm install -g yo
$ npm install -g generator-html-5-bp
```

## Start

You can now run the generator:

```bash
$ yo html-5-bp
```

### Updates

Updates are added from time to time. Make sure you're updated to the latest version of the generator by running:

```bash
$ npm update -g generator-html-5-bp
```

### Note:

If you wish to run the php generator you will be required to have the following installed on your machine.
 * PHP >= 5.5.9
 * Composer (Dependency manager)




### Installing PHP

First check which version of php you're on
```bash
	$ php -v
```
Next run this curl command to update to 5.6/7
```bash
	$ curl -s http://php-osx.liip.ch/install.sh | bash -s 5.6
```
Now you need to update the PATH variable to reference the new php version
```bash
	$ vim ~/.profile
```

Add this to that file and save
```bash
	$ export PATH=/usr/local/php5/bin:$PATH
```

Once you've completed all of the above, run the following
```bash
	$ source ~/.profile
	$ sudo apachectl restart
```

Run php -v once again to check the version has updated




### Installing Composer

Please make sure this is run in root folder, and once done make sure it has been install to /usr/local/bin

```bash
	$ php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
	$ php -r "if (hash_file('SHA384', 'composer-setup.php') === 'e115a8dc7871f15d853148a7fbac7da27d6c0030b848d9b3dc09e2a0388afed865e6a3d6b3c0fad45c48e2b5fc1196ae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
	$ php composer-setup.php
	$ php -r "unlink('composer-setup.php');"
```

Refer to these docs if you'd like to know more https://laravel.com/docs/5.1/installation


## Static HTML or PHP Application

Once the generator is up and running you should see the following:

![Alt text](/readme/screenshots/1.png?raw=true)

At this point you only need to name the project. This will be the name of the directory the project will be scaffolded into.

![Alt text](/readme/screenshots/2.png?raw=true)

You have the option to generate a static html project (boilerplate) for front end development or a php application (laravel). Once the project has been scaffolded the npm installation will take place.


## GIT

After generation has been completed git will have been initialized. Add this your .gitignore file so that you don't add any unneccessary or redundant files.

```bash
dist/*
!dist/assets/

dist/assets/*
!dist/assets/img/
!dist/assets/fonts/

dev/assets/css/*
*.DS_Store
*.sln
Web.config
*.sass-cache
node_modules
npm-debug.log
```


## License

MIT © [Punk]()

[npm-image]: https://badge.fury.io/js/generator-html-5-bp.svg
[npm-url]: https://npmjs.org/package/generator-html-5-bp

