# Liarbirds
To run the work, open the BoidsFromGround project from Production folder.<br>
Here are the steps to get started.
<br><br>
1: Install node/npm<br>
2: Open terminal and go to the BoidsFromGround folder in Production<br>
3: Type npm install. This will install all the dependencies for the project.<br>
4: There are 2 commands that we can use:<br>
### npm run dev
This will compile a script.js and put it in the scripts folder. But it will also ensure that there are source maps for all the code. This can be useful when you're in active development and want to debug your code. Spark doesn't give us a lot of capability but having the source maps is very useful when an error comes.<br><br>

### npm run build
This will compile a script.js and put it in the scripts folder. But it will minify the javascript, so you can't look at anything in the compiled code. We will use this when we are finally exporting the app to Instagram.<br><br>

### Development flow:
We should type npm run dev and keep developing. With every change, webpack compiles the javascript and throws any error if there are any. If the compile is successfull, then we can use SparkAR to run the project.
