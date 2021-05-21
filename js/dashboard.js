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
    //To name the axes on the chart
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Product'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Rank'

                }
            }
        }

    }
});

//Making a connection from categoryList to the html class categories for all links
const categoryList = $("#categories a");
categoryList.click(function (event) {
    //This is to prevent a Default value while loading
    event.preventDefault()
    //By clicking on another link all classes from the other links will be removed
    categoryList.attr('class', '');
    //By clicking on a new link it will get the class selected
    $(this).addClass("selected")
    //By clicking on a category we save the data-name of the category as an ID to use it for the url
    const id = $(this).data("name")
    //Giving the parameter id to the function bestseller
    bestseller(id)
})

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
function bestseller(id) {
    const params = {
        //Please insert here your own API Key, because in Rainforest API trial Version the requests are limited by 100 requests/calls
        api_key: "",
        type: "bestsellers",
        //Url will built by giving the category as an ID by clicking on one
        url: `https://www.amazon.com/s/zgbs/pc/${id}`
    }
    //Start NProgress Library  and shows loading screen because Rainforest API call lastst min. 6seconds
    NProgress.start();
    //Jquery delivery notation => the three dots (...) are needed that the json can be extracted and to describe the properties
    $.get("https://api.rainforestapi.com/request", {
        ...params
    }, function (data) {
        //Get only the ten first result from the bestseller, because 50 is standard from the Rainforest API & to much for a chart
        const topTenBest = data.bestsellers.slice(0, 10);
        //goes through every element from the array and gives back the title from bestseller
        //instead of using a for loop => less code needed also 
        const labels = topTenBest.map(bestseller => bestseller.title);
        const chartData = topTenBest.map(bestseller => bestseller.rank);
        const colors = [
            'rgba(212, 175, 55, 0.2)',
            'rgba(192,192,192, 0.2)',
            'rgba(191, 137, 112, 0.2)',
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


// function to convert canvas (our Chart) to an Image
function exportImage() {
    //select our chart
    const ownChart = document.querySelector("#chart");
    //define which button should be selected in the dashboard.html
    const btnDownload = document.querySelector("#btn-download");

    btnDownload.addEventListener("click", function () {
        //IE/Edge Support (PNG Only) as our research showed that only png is supported 
        // and we had already the discussion that not every browser has the same behaviour 

        //the msSaveBlob method is exclusive for IE/Edge and here we're checking this
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(chart.msToBlob(), "chart-image.png");
            //this part below should support for sure at least chrome and firefox
        } else {
            const a = document.createElement("a");

            // to do: comment
            document.body.appendChild(a);
            //you also can define what image type it should be exported & the image qualit can be set here
            a.href = ownChart.toDataURL();
            //be sure if you change the image type above, you also have to change it here then
            a.download = "chart-image.png";
            a.click();
            // to do: comment
            document.body.removeChild(a);
        }
    });
}





//call the function bestseller, which calls the rainforest API and it's bestseller data for memorycards
bestseller("493964");
//calls the function to export the canvas which is shown in the dashboard.html as png and hopefully all browser are supported
exportImage();