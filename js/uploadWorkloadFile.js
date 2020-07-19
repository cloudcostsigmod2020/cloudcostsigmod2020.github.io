function uploadWorkloadFile(event) {
    // Clear workload
    clearWorkload();

    // Get selected file
    const selectedFile = event.srcElement.files[0];
    document.getElementById("workload-input-file-name").innerHTML = "loading... " + selectedFile.name;
    document.getElementById("workload-input-file-invalid").innerHTML = "";

    // Show indicator
    document.getElementById("loading_indicator_2").style.opacity = 1;

    // Read the file in and calculate input values
    var reader = new FileReader();
    reader.onload = function(evt) {
        var queries = 0;
        var pointLookups = 0;
        var zeroResultPointLookups = 0;
        var writes = 0;
        
        var isValid = true;
        var pointLookupsPercent = "";
        var zeroResultPointLookupsPercent = "";
        var writesPercent = "";

        var lines = evt.target.result.split('\n');
        for(var i = 0; i < lines.length; i++){
            var line = lines[i];

            if(line != "") {
                queries += 1;

                var query = line.split(" ");

                if(query.length == 3 && query[0] == "p" && !isNaN(query[1]) && !isNaN(query[2])) {
                    var key = query[1];
                    KeyHash["" + key] = true;
                    writes += 1;
                } else if(query.length == 2 && query[0] == "g" && !isNaN(query[1])) {
                    var key = query[1];
                    if(undefined !== KeyHash["" + key]) {
                        pointLookups += 1;
                    } else {
                        zeroResultPointLookups += 1;
                    }
                } else {
                    queries = "";
                    isValid = false;
                    break;
                }
            }            
        }

        if(isValid) {
            pointLookupsPercent = Math.round(pointLookups/queries*100)/100;
            zeroResultPointLookupsPercent = Math.round(zeroResultPointLookups/queries*100)/100;
            writesPercent = Math.round(writes/queries*100)/100;
        } else {
            document.getElementById("workload-input-file-invalid").innerHTML = "Invalid format";
        }
        
        // Update the inputs
        document.getElementById("query_count").value = numberWithCommas(queries);
        document.getElementById("v").value = pointLookupsPercent;
        document.getElementById("r").value = zeroResultPointLookupsPercent;
        document.getElementById("w").value = writesPercent;

        document.getElementById("workload-input-file-name").innerHTML = selectedFile.name;

        // Hide indicator
        document.getElementById("loading_indicator_2").style.opacity = 0;
    };
    reader.readAsText(selectedFile);
}

function clearWorkload() {
    var queries = "";
    var pointLookupsPercent = "";
    var zeroResultPointLookupsPercent = "";
    var writesPercent = "";
    document.getElementById("query_count").value = numberWithCommas(queries);
    document.getElementById("v").value = pointLookupsPercent;
    document.getElementById("r").value = zeroResultPointLookupsPercent;
    document.getElementById("w").value = writesPercent;
}