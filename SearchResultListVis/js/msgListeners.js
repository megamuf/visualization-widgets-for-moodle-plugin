var lastProcessedQueryID;

window.onmessage = function (msg) {
    if (msg.data.event) {
        if (msg.data.event === 'eexcess.queryTriggered') {
            // new search has been triggered somewhere, show loading bar or similar
           console.log('queryTriggered')
            $(showLoadingBar());
        }

        if (msg.data.event && msg.data.event === 'eexcess.newResults') {
            // new results are available in msg.data.data
            //console.log('NEW RESULTS')
            //if (lastProcessedQueryID && lastProcessedQueryID === msg.data.data.queryID && $('#eexcess-loading').is(':visible')) {
                // data already processed, do nothing
                //console.log('NEW RESULTS IF')
            //} else {
                //console.log('NEW RESULTS ELSE')
                $(addIsotopeGrid(msg));
                $(logResultItemClicks(msg));

                ////make sure elements exist
                //var checkExist = setInterval(function () {
                //    if ($('.eexcess-isotope-grid-item').length) {
                //        clearInterval(checkExist);
                //        //$(addFilterCounter);
                //        //$(truncateTitles);
                //    }
                //}, 10);

                lastProcessedQueryID = msg.data.data.queryID;
                //console.log(msg.data);
            //}

        } else if (msg.data.event === 'eexcess.error') {
            $(showError(msg.data.data));
        }

    }


}

