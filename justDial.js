
// save data and convert it from JSON
function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

var headers = {
    
    name:"Company Name",
    number:"Contact Number",
    justdialLink:"Just Dial Link",
    websiteLink:"Company's website Link",
    
    starRating:"Star",
    numberOfRating:"Number of Ratings",
    source:"Source",
    type:"Lead Type"
};



async function getNumber(contactInfo){
    resultNumber = ""
    try {

        numberMap=[];
        numberMap[0]="mobilesv icon-acb";
        numberMap[1]="mobilesv icon-yz";
        numberMap[2]="mobilesv icon-wx";
        numberMap[3]="mobilesv icon-vu";
        numberMap[4]="mobilesv icon-ts";
        numberMap[5]="mobilesv icon-rq";
        numberMap[6]="mobilesv icon-po";
        numberMap[7]="mobilesv icon-nm";
        numberMap[8]="mobilesv icon-lk";
        numberMap[9]="mobilesv icon-ji";
    
       
        
        /**
         * loop to reach till end where numbers are listed
         */
        var base= contactInfo;
        while(base.lastElementChild!=null){
            base=base.lastElementChild
        }
        base=base.parentElement
        var contactInfoLength = base.children.length
    
        for (i=0;i<contactInfoLength;i++){
            
            for (j=0;j<10;j++){
                if (numberMap[j]==base.children[i].className){
                    
                    resultNumber=resultNumber+j.toString();

                }
            
            }
            
            
    
        }
    } catch (error) {
        console.log(error)
        return "NA";
        
    }
    return resultNumber;
}


async function extractDetails(fileTitle){
    /**
     * class names which can change with time
     * 
     */
    var result = []
    var companyNameClass="lng_cont_name";
    var contactInfoClass = "contact-info";

    var companyName= document.querySelectorAll("."+companyNameClass);
    var contactInfo=document.querySelectorAll("."+contactInfoClass);
    var skip=0;
    for (let i=0;i<companyName.length;i++){
      
        

        /**
         * Skip if there is no number on listing 
         */
            // use this to map correct number to correct company name 
            if(document.querySelectorAll(".newrtings")[i].nextElementSibling.className=="contact-info ")
            {
                let resultObj = {
                name:"",
                number:"",
                justdialLink:"",
                websiteLink:"NA",
                starRating:"",
                numberOfRating:"",
                source:"Just Dial",
                type:"Agency"
                
            }
            /**
             * Split rating between star and numer of people rated 
             */
            rating=document.querySelectorAll(".newrtings")[i].firstElementChild.innerText.replace('Votes',"").split('\n')
            
            
            resultObj.name=companyName[i].innerHTML;
            resultObj.justdialLink=companyName[i].parentNode.getAttribute("href");
            resultObj.starRating=rating[0]
            resultObj.numberOfRating=rating[1]
            await getNumber(contactInfo[i-skip]).then((result) =>{
                
                /**
                 * formatting number in a proper format
                 */
                resultFinal="";
                for(k=0;k<Math.min(10,result.length);k++){
                    if(k==5)resultFinal=" "+resultFinal;
                    resultFinal=result[result.length-1-k]+resultFinal
                    }

                resultObj.number="+91 "+resultFinal;
              return resultObj.number;  
            }) ;
            result.push(resultObj);
        }
        else {
            skip=skip+1;
            
            
        }
        
       
    
    }
    exportCSVFile(headers, result, fileTitle)

    

}

/**
 * To exceute file just cann extractdetails("filename")
 */
