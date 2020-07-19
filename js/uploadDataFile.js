var KeyHash = new Object();

function uploadDataFile(event) {
    // Clear data
    clearData();

    // Get selected file
    const selectedFile = event.srcElement.files[0];
    document.getElementById("data-input-file-name").innerHTML = "loading... " + selectedFile.name;
    document.getElementById("data-input-file-invalid").innerHTML = "";

    // Show indicator
    document.getElementById("loading_indicator_1").style.opacity = 1;
    
    // Clear hash
    KeyHash = new Object(); 

    // Read the file in and calculate input values
    var reader = new FileReader();
    reader.onload = function(evt) {
        var entries = 0;
        var maxKey = -2147483648;
        var maxValue = -2147483648;
        
        var isValid = true;
        var keySize = "";
        var valueSize = "";
        var entrySize = "";

        var lines = evt.target.result.split('\n');
        for(var i = 0; i < lines.length; i++){
            var line = lines[i];

            if(line != "") {
                entries += 1;

                var entry = line.split(" ");

                if(entry.length != 2 || entry.some(isNaN)) {
                    entries = "";
                    isValid = false;
                    break;
                }

                var key = Number(entry[0]);
                var value = Number(entry[1]);

                maxKey = Math.max(maxKey, key);
                maxValue = Math.max(maxValue, value);

                KeyHash["" + key] = true;
            }            
        }

        if(isValid) {
            keySize = Math.ceil(Math.log2(maxKey)/8);
            valueSize = Math.ceil(Math.log2(maxValue)/8);
            entrySize = keySize + valueSize;
        } else {
            document.getElementById("data-input-file-invalid").innerHTML = "Invalid format";
        }
        
        // Update the inputs
        document.getElementById("N").value = numberWithCommas(entries);
        document.getElementById("E").value = entrySize;
        document.getElementById("F").value = keySize;
        document.getElementById("data-input-file-name").innerHTML = selectedFile.name;

        // Hide indicator
        document.getElementById("loading_indicator_1").style.opacity = 0;
    };
    reader.readAsText(selectedFile);
}

function clearData() {
    var entries = "";
    var keySize = "";
    var entrySize = "";
    document.getElementById("N").value = numberWithCommas(entries);
    document.getElementById("E").value = entrySize;
    document.getElementById("F").value = keySize;
}