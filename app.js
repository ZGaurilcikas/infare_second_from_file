var cheerio = require('cheerio');
var fs = require('fs');

var $ = cheerio.load(fs.readFileSync('file.html'));

var conn_data = [];
var direct_data = [];
var return_data = [];
var return_data_conn = [];

for (var i = 0; i <= 17; i++) {
    $('#WDSEffect_table_0').each((e, el) => {

        var day_dep = "Monday 4 Feb";

        var stockholm = $(el)
            .find(' #toggleId_0_' + i + ' > table > tbody > tr:nth-child(2) > td.route.last > span:nth-child(1) > span.location')
            .text().slice(0, 9);

        var london = $(el)
            .find('#toggleId_0_' + i + ' > table > tbody > tr.flight > td.route > span:nth-child(3) > span.location')
            .text().slice(0, 6);

        var oslo = $(el)
            .find('#toggleId_0_' + i + ' > table > tbody > tr:nth-child(2) > td.route > span:nth-child(3) > span')
            .text();

        //check only for direct flight's from Stockholm to London

        if (stockholm == "Stockholm" && london == "London") {
            // price 
            var price = $(el)
                .find('#choice_0_' + i + '_ECOA > span.price > #price_0_' + i + '_ECOA').text();

            //departure time in Stochholm
            var dep_time = $(el)
                .find('#idLine_0_' + i + ' > td.time > span:nth-child(1)').text();

            //arrival time in London
            var arr_time = $(el)
                .find(' #idLine_0_' + i + ' > td.time > span:nth-child(3)').text();

            //put all data in object
            direct_data[i] = {
                Day: day_dep,
                Price: price,
                StockholmDepartureTime: dep_time,
                LondonArrivalTime: arr_time
            };

            // check all flight's with connection at Oslo
        } if (stockholm == "Stockholm" && oslo == "Oslo") {
            var conn_price = $(el)
                .find('#choice_0_' + i + '_ECOA > span.price > #price_0_' + i + '_ECOA')
                .text();;

            var conn_time_in_stockholm = $(el)
                .find('#toggleId_0_' + i + ' > table > tbody > tr:nth-child(2) > td.first.time > span:nth-child(1)')
                .text();

            var conn_time_in_oslo = $(el)
                .find('#toggleId_0_' + i + ' > table > tbody > tr:nth-child(2) > td.first.time > span:nth-child(3)')
                .text();

            var conn_dep_time_in_oslo = $(el)
                .find('#toggleId_0_' + i + ' > table > tbody > tr:nth-child(5) > td.first.time > span:nth-child(1)')
                .text();

            var conn_arr_time_in_london = $(el)
                .find('#toggleId_0_' + i + ' > table > tbody > tr:nth-child(5) > td.first.time > span:nth-child(3)')
                .text();

            //put data in object
            conn_data[i] = {
                Day: day_dep,
                ConnPrice: conn_price,
                Stockholm: conn_time_in_stockholm,
                OsloArr: conn_time_in_oslo,
                OsloDep: conn_dep_time_in_oslo,
                LondonArr: conn_arr_time_in_london
            };
        } else {
            // console.log(i+" No direct or connected Oslo")
        }
    });
}
for (var i = 0; i <= 18; i++) {
    $('#WDSEffect_table_1').each((e, el) => {

        var return_day = "Sun 10 Feb";

        var out_london = $(el)
            .find('#toggleId_1_' + i + ' > table > tbody > tr.flight > td.route.last > span:nth-child(1) > span.location')
            .text().slice(0, 6);

        var out_stockholm = $(el)
            .find('#toggleId_1_' + i + ' > table > tbody > tr.flight > td.route.last > span:nth-child(3) > span.location')
            .text().slice(0, 9);

        var out_oslo = $(el)
            .find('#toggleId_1_' + i + ' > table > tbody > tr:nth-child(2) > td.route.last > span:nth-child(3) > span')
            .text();

        if (out_london == "London" && out_stockholm == "Stockholm") {
            var return_price = $(el)
                .find('#choice_1_' + i + '_ECONBG > span.price > #price_1_' + i + '_ECONBG')
                .text();

            var return_dep_time = $(el)
                .find('#idLine_1_' + i + ' > td.time > span:nth-child(1)')
                .text();

            var return_arr_time = $(el)
                .find('#idLine_1_' + i + ' > td.time > span:nth-child(3)')
                .text();

            return_data[i] = {
                ReturnDay: return_day,
                ReturnPrice: return_price,
                ReturnTimeLondon: return_dep_time,
                ReturnTimeStochholm: return_arr_time
            };
        }
        if (out_london == "London" && out_oslo == "Oslo") {
            var return_conn_price = $(el)
                .find('#choice_1_' + i + '_ECONBG > span.price > #price_1_' + i + '_ECONBG')
                .text();

            var return_conn_dep_london = $(el)
                .find('#toggleId_1_' + i + ' > table > tbody > tr:nth-child(2) > td.first.time > span:nth-child(1)')
                .text();

            var return_conn_arr_oslo = $(el)
                .find('#toggleId_1_' + i + ' > table > tbody > tr:nth-child(2) > td.first.time > span:nth-child(3)')
                .text();

            var return_conn_dep_oslo = $(el)
                .find('#toggleId_1_' + i + ' > table > tbody > tr:nth-child(5) > td.first.time > span:nth-child(1)')
                .text();

            var return_conn_arr_stockholm = $(el)
                .find('#toggleId_1_' + i + ' > table > tbody > tr:nth-child(5) > td.first.time > span:nth-child(3)')
                .text();

            return_data_conn[i] = {
                ReturnDay: return_day,
                ReturnPrice: return_conn_price,
                ReturnTime: return_conn_dep_london,
                ReturnStopArrTime: return_conn_arr_oslo,
                ReturnStopDepTime: return_conn_dep_oslo,
                ReturnTimeFinal: return_conn_arr_stockholm
            };
        }
    });
}


//console results of all direct flight's
console.table(direct_data)
//Collect all prices and return cheapest price
//return array with price
var direct_cheap = direct_data.map(Number => Number.Price);
//return elments which a not empty
var direct_cheap_filtered = direct_cheap.filter(function (el) {
    return el != null;
});
//convert string to number with . seperator
var direct_cheap_result = direct_cheap_filtered.map(function (x) {
    return parseFloat(x.replace(/,/, '.'));
});
//find cheapest price
direct_cheap_result = Math.min(...direct_cheap_result)
console.log("Cheapest price is: " + direct_cheap_result);


//flight with connection at Oslo
console.table(conn_data)
var conn_cheap = conn_data.map(Number => Number.ConnPrice);
var conn_cheap_filtered = conn_cheap.filter(function (el) {
    return el != null;
});
var conn_cheap_result = conn_cheap_filtered.map(function (x) {
    return parseFloat(x.replace(/,/, '.'));
});
conn_cheap_result = Math.min(...conn_cheap_result)
console.log("Cheapest price is: " + conn_cheap_result);



//return flight's data
console.table(return_data)
var return_cheap = return_data.map(Number => Number.ReturnPrice);
var return_cheap_filtered = return_cheap.filter(function (el) {
    return el != null;
});
var return_cheap_result = return_cheap_filtered.map(function (x) {
    return parseFloat(x.replace(/,/, '.'));
});
return_cheap_result = Math.min(...return_cheap_result)
console.log("Cheapest price is: " + return_cheap_result);



//return flights with connection at Oslo
console.table(return_data_conn)
var cheap_return_conn = return_data_conn.map(Number => Number.ReturnPrice);
var cheap_return_conn_filtered = cheap_return_conn.filter(function (el) {
    return el != null;
});
var cheap_return_conn_result = cheap_return_conn_filtered.map(function (x) {
    return parseFloat(x.replace(/,/, '.'));
});
cheap_return_conn_result = Math.min(...cheap_return_conn_result)
console.log("Cheapest price is: " + cheap_return_conn_result);

