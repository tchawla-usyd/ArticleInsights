# ArticleInsights

Article Insight is a web application providing various analytics about Wikipedia articles and their associated revisions. These analytics can be divided into three categories: overall (capturing statistics across all the revisions in the database - e.g. which article has the most revisions), article-specific (capturing statistics relevant to a particular article - e.g. for article ‘Australia’, who made the most revisions in total) and author-specific (capturing statistics relevant to a particular author - e.g. for an author, show me a list of all revisions made by them). All statistics are generated in real time based on the information currently available in the database. In order to access this information, users must either register an account or login via an already registered account.

##Instructions for Setting up the Database:
* Import the dataset from this location. [Click here](https://drive.google.com/open?id=1OuaWEfPs_hkArmBNiXj892TXgx1SCf7W)
* To import the data into MongoDB, use the command line to navigate into the given dataset folder and enter the following command:

`@echo off
for %%f in ("*.json") do (
"C:\Program Files\MongoDB\Server\4.2\bin\mongoimport.exe" --jsonArray --db insightdb --collection revisions --file "%%~nf.json"
)`

* The MongoDB database for this application has:
Database Name : “insightdb”
Collections: “revisions” , “User”

##Instructions for running this project:
* After downloading the master-folder from the GitHub repository, extract it to a directory of your choice.
* Open up Terminal (if you’re using Mac/Linux) or Command Prompt (if you’re using Windows)
* Navigate to the server folder (by typing cd filepathtoDIR/Web_dev_4-master/server where DIR is the directory you extracted to). Type the following commands:
  a) npm install
  b) npm install -g nodemon
  c) npm run dev.
* Open another terminal window and navigate to the client folder (/client instead of/ server in the cd command) and type the same 3 commands as for the server.
* Type localhost:4200 in the browser to access the site.

