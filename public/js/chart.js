let positives = JSON.parse(
  "[" + document.currentScript.getAttribute("positives") + "]"
);
let dates = document.currentScript.getAttribute("dates").split(",");
let newPositives = document.currentScript
  .getAttribute("newPositives")
  .split(",");

console.log("Positives: ", positives);
console.log("New Positives: ", newPositives);
console.log("Dates: ", dates);

let ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: dates,
    datasets: [
        {
          label: "New Positive Cases",
          backgroundColor: "rgb(56, 163, 229)",
          borderColor: "rgb(56, 163, 229)",
          data: newPositives,
        },
      {
        label: "Total Positive Cases",
        backgroundColor: "rgb(255, 98, 132)",
        borderColor: "rgb(255, 98, 13)",
        data: positives,
      },
    ],
  },
});
