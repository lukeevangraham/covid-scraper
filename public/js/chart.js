let positives = JSON.parse("[" + document.currentScript.getAttribute('positives') + "]")
let dates = document.currentScript.getAttribute('dates').split(",")

console.log("Positives: ", positives);
console.log("Dates: ", dates);

let ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: dates,
        datasets: [{
            label: 'Total Positive Cases',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: positives
        }]
    }
})