let cheerio = require("cheerio");
let axios = require("axios");

axios.get("https://www.sandiegocounty.gov/content/sdc/hhsa/programs/phs/community_epidemiology/dc/2019-nCoV/status.html#Table").then(function(response) {
    let $ = cheerio.load(response.data);


    let results = [];

    // let table = $("tbody").html()

    let totalPositives = $("tbody > tr:nth-child(3) > td:nth-child(2) > b").text();
    let hospitalizations = $("tbody > tr:nth-child(19) > td:nth-child(2)").html();
    let intensiveCare = $("tbody > tr:nth-child(20) > td:nth-child(2)").html();
    let deaths = $("tbody > tr:nth-child(21) > td:nth-child(2)").html();


    console.log("Total Positives: ", totalPositives);
    console.log("Hospitalizations: ", hospitalizations);
    console.log("Intensive Care: ", intensiveCare);
    console.log("Deaths: ", deaths);
})