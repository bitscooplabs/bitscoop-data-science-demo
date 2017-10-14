# 3. Set up an RDS box, configure networking, and deploy the code to Amazon Lambda
You first need set up some network configurations. We’re going to create everything from scratch so that you don’t interfere with anything you may already have in AWS.

Go to IAM roles and create a new role. Click Select next to AWS Lambda. You will need to add three policies to this role:

```javascript
AWSLambdaBasicExecution
AWSCloudFormationReadOnlyAccess
AWSLambdaVPCAccessExecution
  ```
Click Next Step, give the role a name, and then click Create Role. This role will be used by the Lambda function to specify what it has permission to access.

Go to your [VPCs](https://console.aws.amazon.com/vpc/home#vpcs:) and create a new one. Tag it with something like ‘bitscoop-demo’ so you can easily identify it later. For the IPv4 CIDR block, enter 10.0.0.0/16, or something similar if that is already taken. Leave IPv6 CIDR block and tenancy as their defaults and create the VPC. Once it’s created, select it in the list, then click the Actions dropdown, click Edit DNS Hostnames, click the Yes radio button, then save it.

View your [Subnets](about:invalid#zSoyz). You should create four new subnets. Two of these will be public subnets, and two will be private. Call the public ones ‘public1’ and ‘public2’, and the private ones ‘private1’ and ‘private2’. Make sure they are all on the ‘bitscoop-demo’ VPC we created. One public and one private subnet should be in the same availability zone, and the other public and private subnets should be in different AZs, e.g. public1 in us-east-1a, public2 in us-east-1c, private1 in us-east-1a, and private2 in us-east-1b. Remember which AZ is shared between a public and private subnet for later. The CIDR block needs to be different for each subnet and they all need to fall within the CIDR block of the VPC; if the VPC block is 10.0.0.0/16, you could use 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24, and 10.0.3.0/24. AWS will let you know if anything overlaps.

Go to your [Internet Gateways](https://console.aws.amazon.com/vpc/home#igws:). Create a new Gateway and tag it with whatever you want. Once it’s created, select it in the list and click ‘Attach to VPC’, then select the ‘bitscoop-demo’ VPC and click ‘Yes, Attach’.

Go view your [NAT Gateways](https://console.aws.amazon.com/vpc/home#NatGateways). Create a new Gateway, and for the subnet pick the public subnet that shares an AZ with a private subnet, e.g. ‘public1’ in the example above. Click Create New EIP and then Create the gateway. If for some reason AWS says that you have the maximum number of EIP’s, re-use one that you’ve already claimed.

This new gateway should have an ID nat-<ID>. It should be noted that, while almost everything in this demo is part of AWS’ free tier, NAT gateways are NOT free. They’re pretty cheap, at about $0.05 per hour and $0.05 per GB of data processed, but don’t forget to delete this when you’re done with the demo (and don’t forget to create a new one and point the private route table to the new one if you revisit this demo). Elastic IP’s are also not free, so don’t create any more than you need and delete the ones you do create when you’re done with the demo.

Go to [Route Tables](https://console.aws.amazon.com/vpc/home#routetables) and create two new ones. Name one ‘public’ and the other ‘private’, and make sure they’re in the ‘bitscoop-demo’ VPC. When they’re created, click on the ‘private’ one and select the Routes tab at the bottom of the page. Click Edit, and add another route with a destination of 0.0.0.0/0 and a target of the NAT gateway we just created (so nat-<ID>, not igw-<ID>). Save the private route table.

Now select the ‘public’ route table and select the Routes tab. Click Edit, then add another route with a destination of 0.0.0.0/0 and a target of the Internet Gateway we just created (igw-<ID>). Save the public route table.

Go back to the subnets and click on one of the ‘private’ ones. Click on the Route Table tab, click Edit, and change it in the dropdown to the ‘private’ Route Table that you created in the previous step. Then click Save. Repeat this for the other ‘private’ subnet. For both ‘public’ subnets, click on the Route Table tab, click Edit, change the selection in the dropdown to the ‘public’ route Table, then click Save.

You also need to create a couple of [Security Groups](https://console.aws.amazon.com/vpc/home#securityGroups:). Name the first one ‘rds’ and make sure it’s in the ‘bitscoop-demo’ VPC, then create it. Click on it in the list, click on the Inbound Rules tab, and then click Edit. You’ll want to add a MySQL/Aurora rule (port 3306) for 10.0.0.0/16 (or whatever CIDR block you picked for the VPC) so Lambda can access the RDS box internally. Additionally, look up the [CIDR block for QuickSight](http://docs.aws.amazon.com/quicksight/latest/user/regions.html) for your region and add an additional MySQL/Aurora rule for that. If you want to make sure that the box you’re going to set up is working as intended, you can also add a MySQL/Aurora rule for your IP address. You do not need to add any Outbound Rules.

You also need to add a Security Group called ‘lambda’. This does not need any Inbound Rules, but it does need Outbound Rules for HTTP (80) to 0.0.0.0/0, HTTPS (443) to 0.0.0.0/0, and MySQL/Aurora (3306) to 10.0.0.0/16.

Finally, you will set up the [RDS](https://console.aws.amazon.com/rds/home) box to store the data that will be generated. Go to RDS’ [Subnet Groups](https://console.aws.amazon.com/rds/home#db-subnet-groups:) and create a new one. Give it a name and description, and for VPC select ‘bitscoop-demo’. You’re going to be adding both of the public subnets, which will require you to select one of the availability zones that has a public subnet, select that subnet, add it to the group, then select the other AZ that has a public subnet, select that subnet, and add it to the group. It’s important that no private subnets are part of this group. Click Create when both have been added.

Click on Instances and select Launch DB Instance. For this demo we are using MySQL; if you wish to use a different database, you may have to install a different library in the demo project and change the Sequelize dialect to t
hat db.

Click on MySQL (or whatever Engine you want) and then click the Select button next to the version you wish to use (MySQL only has one version as of this publication). On the ‘Production?’ page we recommend selecting the Dev/Test instance of MySQL to minimize the cost to you; test instances can be run cost-free as part of AWS’ free tier. Click Next Step to go to ‘Specify DB Details’. On this page you can click the checkbox ‘Only show options that are eligible for RDS Free Tier’ to ensure you don’t configure a box that costs money.

Select a DB Instance class; db.t2.micro is normally free and should be sufficient for this demo, as should the default storage amount (5GB as of publication). Pick a DB Instance Identifier, as well as a username and password. Save the latter two for later reference, as you will need to set Environment Variables in the Lambda function for them so that the function can connect to the DB. Click Next Step.

On the Advanced Settings screen, select the ‘bitscoop-demo’ VPC. Under VPC Security Group(s), select the ‘rds’ group we created earlier. Make sure to give the database a name and save this name for later use, as it too will need to be added to an Environment Variable. Also make sure the box is publicly accessible, and make sure the Availability Zone is the one that’s shared between a public and private subnet (us-east-1a in the above example). Click Launch DB Instance.

Go to your [RDS instances](https://console.aws.amazon.com/rds/home#dbinstances). When the box you just created is ready, click Instance Actions, then See Details. Look at the second column, Security and Network. Take note of the Endpoint field near the bottom. Save this for later use, as it will be used in another Environment Variable.

This should take care of all of the networking requirements. You will now need create a new Lambda function with the project code.

Go to [Lambda Home](https://console.aws.amazon.com/lambda/home) and click ‘Create a Lambda function’. For the blueprint select ‘Blank Function’. For the trigger, click the gray dashed box and select ‘Cloudwatch Events — Schedule’. Name the trigger whatever you want. The schedule expression can be whatever you want as well;

`cron(0 17 ? * MON-SUN *)`

will run the function once a day at 17:00 UTC. The documentation for schedule expressions can be found [here](http://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html).

Name the function something and set the runtime to Node.js 6.10. For Code Entry Type click the dropdown and select ‘Upload a .ZIP file’, then click on the Upload button that appears and then navigate to and select the bitscoop-data-science-demo-<version>.zip file.

You will need to add several Environment Variables, with the number depending on how many services you wish to run. You will always need to add the following variables:

- BITSCOOP_API_KEY (obtainable at https://bitscoop.com/keys)

- PORT (by default it’s 3306)

- HOST (the endpoint for the RDS box, < Box name>.< ID>.< Region>.rds.amazonaws.com)

- USER (the username you picked for the RDS box)

- PASSWORD (the password you set for the RDS box)

- DATABASE (the database name you set for the RDS box)

If you are getting data from GitHub, you will need to add these:

- GITHUB_MAP_ID (The ID of the BitScoop API map you created for GitHub)

- GITHUB_USER (the username that owns the repo you’re interested in)

- GITHUB_REPO (the name of the repo you’re interested in)
If you are getting data from Google Analytics, you will need to add these:

- GOOGLE_MAP_ID (The ID of the BitScoop API map you created for Google)

- GOOGLE_GA_VIEW_ID (the ID of the View you are monitoring)

- GOOGLE_CONNECTION_ID (the ID of the BitScoop Connection you created to the Google Analytics API Map)

- If you are getting data from StatusCake, you will need to add these:

- STATUSCAKE_MAP_ID (The ID of the BitScoop API map you created for StatusCake)

- STATUSCAKE_TEST_ID (the ID of the Test you are monitoring)
If you are getting data from Postman, you will need to add these:

- POSTMAN_MAP_ID (The ID of the BitScoop API map you created for Postman)

- POSTMAN_MONITOR_ID (the ID of the Monitor you are running)

The Handler should be ‘index.handler’. For the role, select ‘Choose an existing role’, and from the Existing Role dropdown select the role that you created earlier.

Open the Advanced Settings accordion. You’ll probably want to set the Timeout to 10 seconds. Under VPC select the ‘bitscoop-demo’ VPC. For Subnets add the two ‘private’ subnets, and for the Security Group select ‘lambda’ one we created. Hit next and you’ll be taken to a review screen, and then select ‘Create Function’ at the very bottom of the page.

If you did not set a trigger earlier, go to the details for the function and click the tab ‘Triggers’. Click ‘Add Trigger’, click on the dashed gray box, then ‘Cloudwatch Events — Schedule’. See above for the remaining steps to set up a scheduled trigger. Then click Submit.

Your Lambda function should be good to go. See after step 4 for instructions on how to test the function.
