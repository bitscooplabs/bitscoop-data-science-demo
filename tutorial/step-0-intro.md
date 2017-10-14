Data Science is booming in every industry. More data from more sources is being analyzed than ever before by new data science departments popping up in every major company. Traditionally, data scientists only worked with existing datasets in databases or flat files.

The modern landscape is requiring data scientists to expand their list of data sources to live data, scraping, and complex ETL tasks. Extract knowledge and insight from your data stored in apps or data on the web currently requires writing complex scheduling scripts manually or using solutions with a limited list of pre-made connections.

The BitScoop platform can easily connect to a wide range of data sources, perform complex ETL tasks, and work with best in class scheduling, storage, and data visualization solutions.

In our “Built with BitScoop” series, we show very specific use cases for the BitScoop platform to give you ideas and foundations for new projects.

Today we demonstrate how to build a data pipeline using the BitScoop Platform and AWS. We are going to collect data about a demonstration DevOps stack to see if we can derive insights about how our development and stack performance relates to our user experience.

We are going to help out the imaginary company “Dog.Breed”. Dog.Breed is a popular website of dog breeds and also hosts a public API for every breed of dog. Their site and API are very popular but their website and API seem to randomly be going down. Their DevOps team can’t make sense of their traffic or their code history and need help from their Data Science department to make sense of what’s happening. With BitScoop and other data science tools, we will consolidate their data and answer:

- Do product code releases relate to a change in site activity such as new users?

- Do site traffic spikes relate to outages of the API?

- Do new user spikes relate to outages of the site?

- Do outages of the API relate to outages of the site?

- Do outages of the API or relate to higher number of code commits?

We are going to use the BitScoop Platform, AWS Lambda, AWS Storage, and a data explorer to create a robust data science platform to help answer these questions. BitScoop will easily consolidate and transform the data from various API and Microservices. AWS Lambda will schedule and execute calls to the BitScoop Platform to periodically update our dataset on a 5 minute basis. The AWS Lambda function will then store the data in an AWS storage service. We will then access the data with a data exploring suite and visualize queries to gain insights.

Our demo example code works with any SQL compatible datastore, including AWS RDS datastores such as AWS Aurora, MySQL, MariaDB, and PostgreSQL. This code can easily be modified to support AWS Redshift or storing flat logs in AWS S3. This data pipeline architecture also allows the BitScoop platform to insert data into many major other data systems such as Hadoop, ElasticSearch, MongoDB, or Cassandra.

We will also be using AWS QuickSight and Tableau to access our SQL Database and perform some data science tasks. This data pipeline architecture also allows the BitScoop platform to connect to other machine learning, analysis services, or data visualization tools such as Google Cloud Prediction API, IBM Watson & Alchemy APIs, or Kibana.

This powerful data science workflow is all built with BitScoop as the unified interface for the requisite APIs. We use Google Analytics, StatusCake, Postman, and GitHub for this demo, but you can easily add other services such as Pagerduty, Kubernetes, Chef, Docker, or AlertLogic. This project is open source and the related GitHub project is listed below. Feel free to use it as the foundation of your next great project. This demo uses the same API maps as the Alexa demo app “Ops Buddy,” which enables Alexa to tell me in real-time how my stack is doing.

Building this BitScoop powered Data Science Project is comprised of four steps.

1. Create accounts, add API maps to BitScoop, and set up authorization

2. Download the Demo “Dog.Breed” project

3. Set up an RDS box and networking and deploy the code into Amazon Lambda

4. Explore the data in AWS QuickSight or Tableau

Note that step 1 is identical to the Alexa Skill demo, so if you have already set up that demo you can skip to step 2.
