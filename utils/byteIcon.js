const fetch = require('node-fetch');
const fs = require('fs');


function fetchFav () {

    let webSite = 'http://s2.googleusercontent.com/s2/favicons?domain_url=http://www.udemy.com'
    
    return fetch(webSite) // returns the promise
    .then(function(res) {
        
        let jsonData = JSON.stringify(res, undefined, 2);
        //  parse the json for png data

        let img_data = JSON.parse(jsonData)                                                       .body
                                   ._readableState
                                   .buffer
                                   .head
                                   .data
                                   .data;
        // console.log(img_data);
        return img_data;
        
    });
    
}

// fetchFav();
module.exports  = {
    fetchFav  
}
