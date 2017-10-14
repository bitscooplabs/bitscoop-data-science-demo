# 4. Explore the data in AWS QuickSight
Congratulations! The BitScoop powered data science platform is now up and running. Let’s see what this data can tell us to help the data scientists at our imaginary company, Dog.Breed.

**Connect the Data to AWS QuickSight**

After signing up for QuickSight, navigate to the [Start page](https://us-east-1.quicksight.aws.amazon.com/sn/start). Click New Analysis, then New Data Sets. You’ll want to create a new data set from a New Data Source, specifically RDS. Enter a name for this data source, then click on the down arrow on Instance and then click on the name of the RDS box. It should auto-populate the database name for you. Enter the username and password, then validate the connection. When that succeeds, click Create data source.

From there, select the table you want to analyze and click the Select button. By default QuickSight will have selected import to SPICE; leave it as is and click Visualize.

We will now create five charts to help determine the answers to the key questions we asked before. First select the “+ Add” button in the top left of Quicksight. Then select the “Visualize” bar on the right and ensure that the SPICE data set is chosen. Select the time field in blue to be mapped to the X axis of the visualization. Now you make select any column in order to visualize the different data sets together over time. The follow are the corresponding dimensions (columns vs time) used to answer each question from the data.

**Do product code releases relate to a change in site
activity such as new users?**

*Chart code pushes, code releases, visitors, and new visitors over time.*

**Do site traffic spikes relate to outages of the API?**

*Chart API test alerts and visitors over time.*

**Do new user spikes relate to outages of the site?**

*Chart new visitors and site outage alerts over time.*

**Do outages of the API relate to outages of the site?**

*Chart API outages and Site outages over time.*

**Do outages of the API or relate to higher number of code commits?**

*Chart API outages and Code commits over time.*

# Exploring the data with other analysis products
Connecting other products to RDS, such as Tableau, DataIku, or Paxata, should be similar to connecting QuickSight. One thing you may have to differently is configure the RDS security group to accept incoming requests from whatever IP address or IP range this other service is calling from. The instructions above had you add QuickSight’s IP range to the RDS security group, but this is not what another service would be using.

Here is an example of the connection dialog in Tableau
Everyone at Dog.Breed is super impressed with the Data Science team for finally making sense of the drivers of their KPIs. The Data Science team gets a huge promotion and bonus.

Users are only beginning to explore what is possible on BitScoop Should you have any questions, don’t hesitate to reach out at https://bitscoop.com/support.
