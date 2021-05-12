//Creating chart, information from chart.js documentation --> https://www.chartjs.org/docs/latest/
//checke here for difference between const & let: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/const
const ctx = document.getElementById('chart').getContext('2d');
const xlabels = [];
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: xlabels,
        datasets: [{
            label: 'Top 10 Bestsellers',
            data: [],
            backgroundColor: [],
        }]
    },
});


//This function is needed to update the Chart on the dashboard.html page
function updateChart(labels, data, backgroundcolors) {

    myChart.data.labels = labels;
    myChart.data.datasets = [{
        //Do not rename these variables! They're chart.js speficiv and standard who are needed for the chart
        label: 'Top 10 Bestsellers',
        data: data,
        backgroundColor: backgroundcolors

    }];
    myChart.update();
}

//Function needed to call the API Rainforest, especially the bestseller part for memorycards
function bestseller() {
    const params = {
        //Please insert here your own API Key, because in Rainforest API trial Version the requests are limited by 100 requests/calls
        api_key: "",
        type: "bestsellers",
        url: "https://www.amazon.com/s/zgbs/pc/516866"
    }
    //Start NProgress Library  and shows loading screen because Rainforest API call lastst min. 6seconds
    NProgress.start();
    //Jquery delivery notation => the three dots (...) are needed that the json can be extracted and to describe the properties
    $.get("https://api.rainforestapi.com/request", {...params}, function (data) {
        //Get only the ten first result from the bestseller, because 50 is standard from the Rainforest API & to much for a chart
        const topTenBest = data.bestsellers.slice(0, 10);
        //goes through every element from the array and gives back the title from bestseller
        //instead of using a for loop => less code needed also 
        const labels = topTenBest.map(bestseller => bestseller.title);
        const chartData = topTenBest.map(bestseller => bestseller.rank);
        const colors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ];

        updateChart(labels, chartData, colors);
        
        //When the API Call is finished and all Data are fully the whole chart will show up
        NProgress.done();
    })

}

//call the function bestseller, which calls the rainforest API and it's bestseller data for memorycards
bestseller();