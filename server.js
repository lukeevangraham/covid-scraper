let cheerio = require("cheerio");
let axios = require("axios");

axios.get("https://www.sandiegocounty.gov/content/sdc/hhsa/programs/phs/community_epidemiology/dc/2019-nCoV/status.html#Table").then(function(response) {
    let $ = cheerio.load(response.data);


    let results = [];

    // let table = $("tbody").html()

    let totalPositives = $("tbody > tr:nth-child(3) > td:nth-child(2) > b").text();

    // #content-secondary > div.body-par.parsys > div.table.parbase.section > table > tbody > tr:nth-child(3) > td:nth-child(2)


    // console.log($("#content-secondary > div.body-par.parsys > div.table.parbase.section > table > tbody > tr:nth-child(3) > td:nth-child(4)"))

    console.log("LOOK HERE: ", totalPositives);
})