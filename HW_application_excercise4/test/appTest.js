const supertest = require('supertest');
const expect = require('chai').expect;
const mocha = require('mocha');
const addContext = require('mochawesome/addContext');
const fs = require('fs');
const test_data = JSON.parse(fs.readFileSync('./Data/TestData.json', 'utf8'));
const base_url = supertest("https://api.nasa.gov/");
const endpoint = ("/DONKI/CME?");
var response ;
var body;

const nasa_CME_API = async function (req) {
    return base_url.get(endpoint).query({
        startDate: `${req.startTime}`,
        endDate: `${req.endTime}`,
        api_key: 'DEMO_KEY'
    })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send();
}

test_data.forEach(async  function(data) {
describe(`Tests for FLR  API for the test input  start time : ${data.startTime} ,end time : ${data.endTime}`, function () {

    before(async function () {
        response = await nasa_CME_API(data);
        
        body = response.body;
    });

    it('Verify the status code is 200', function () {
        let status = response.status;
        
        expect(response.status).to.equal(200, "Expected status code is 200 .Actual status code from the API response is : [" + expect(response.status) + "]");
        
    });

    it('Verify that response has returned more than one record' , function() {

        expect(body.length).above(1);
    });

    it('Verify that response is sorted based upon CME startTime' , function() {
        var timestamp = [];
        var sortedYes;
       body.map(X=>timestamp.push(X.startTime));
      
       for (var i =0 ; i < timestamp.length-1 ; i++) {
           var ts1 = new Date (timestamp[i]).getTime;
           var ts2 = new Date (timestamp[i+1]).getTime;
           if( ts1 > ts2) {
            sortedYes = false;
           } else {
            sortedYes = true;
           }
       }

       expect(sortedYes).to.equal(true);
    })
    
    it('Verify that starttimestamps and endtimestamps from the CME response are within the date range given by the user' , function () {
        var timestamp = [];
        var sortedYes;
       body.map(X=>timestamp.push(X.startTime));
       var len = timestamp.length;
       var ts1 = new Date (timestamp[0]).getTime();
       var ts2 = new Date (timestamp[len-1]).getTime();

       expect(ts1).above(new Date (data.startTime).getTime());
       expect(ts2).below(new Date (data.endTime).getTime());

       
    });
});
});