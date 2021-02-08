# CityServiceTyres_Rest_API

Runtime environment: Node.js, Express

Programming languages: JavaScript ES6, HTML, CSS



1. Structure:

−	rest/index.js is entry point of the project;

−	Static directory contains static files of view model. Entry point is index.html, main.js is managing index.html content and post requests to /api/index.js; Assets directory contains css/style.css; faq/faq.js – content of FAQ part of site; season/season_initial.js – pricing content of site; email/send_email.js – send email section of site;
  
−	API directory contains following files: userActions.js contains operators for get and post data into data collection file (json format); user.js manages received data form front-end requests and handles it; initialFileStructure.js is initial content for data collection file (json);

− 	Directory data contains data collection files created on season basis. 

2.	Main functionalities.

2.1.	rest api controllers are collecting data form input fields of https://cityservicetires.com as follows:

−	date (restricted start and end periods);

−	 time (reservation hours available);

−	email;


2.2.	Requested information and massages.

−	all fields need to be duly completed, if any field remains unfulfilled message requiring fields fulfilment appears;

−	 in case of existing email a message appears;

−	if wrong date is selected a message requesting new date appears;

−	when all data is correct and order is set a message confirming reservation appears;



3.	Algorithms:

−	

