# electron-angular-pouchdb

This is my base project for connecting electron with angular and pouchdb.

It is heavily borrowed from this [CouchBase Tutorial](http://blog.couchbase.com/build-a-desktop-app-with-github-electron-and-couchbase), and most of the code is cloned and modified from [this repository](https://github.com/couchbaselabs/pouchdb-angularjs-app).

If you have electron already installed, you can clone this repository and run "electron ." while in the correct folder and it should start right up!

I'm currently having issues with a memory leak. It was pre-existing (I didn't write the leaky code) so I'm trying to fiddle around and fix it / write my own functions from scratch to fix the problem. I'm making a lot of small commits as I try to keep my streak alive. 