#Bhamni Registration application

This application will help users register a new patient in OpenMRS.

To set up the application, do the following

1. Install the modules required globally (This is a one time task)
npm install -g bower
npm install -g grunt-cli
gem intall compass

2. Set up local node dependencies. (This installs all the node
dependencies into node_modules.

  npm install


3. Set up UI components (This installs all the UI dependencies into
app/components)

  bower install

4. Build the project with grunt

grunt (Other options are grunt server and grunt test)
