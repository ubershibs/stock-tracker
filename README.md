# Stock Tracker
I built this app as my solution for Free Code Camp's [Chart the Stock Market](https://www.freecodecamp.com/challenges/chart-the-stock-market) project, which is one of the dynamic web app's you have to build to earn its Back End Web Development Certification process. Users can add any stock using its symbol (provided the stock is tracked in Quandl's WIKI data source), and add it/compare it to other stock prices over various stretches of time (charts generated by Highcharts, which is one of several pretty cool  JS charting tools I've encountered so far - more detailed but slightly less whimsical than Chart.JS). The cool/strange thing about this app is that, thanks to socket.io/Websockets, users see the chart update in real-time as other users add/remove stocks. Which can be a tiny bit frustrating if there's a stock you wanted to see... But them's the rules!

See it in action: https://ubershibs-stock-tracker.herokuapp.com

### User Stories
- I can view a graph displaying the recent trend lines for each added stock.
  - Status: Done 
- I can add new stocks by their symbol name.
  - Status: Done.
- I can remove stocks.
  - Status: Done.
- I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.
  - Status: Done.

### Built Using
- Node
- Express
- MongoDB
- Socket.io
- Data from [Quandl](https://www.quandl.com/)
- Charts courtesy [Highcharts](http://www.highcharts.com/)
- Bootstrap
