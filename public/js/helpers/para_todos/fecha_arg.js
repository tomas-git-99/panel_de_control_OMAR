export const fechaARG = (data) => {

    if(data == "- -" ){
        return "- -"
    }else{
        let fecha = new Date(data);
        var month = fecha.getUTCMonth() + 1; //months from 1-12
        var day = fecha.getUTCDate();
        var year = fecha.getUTCFullYear();
        
        return day + "/" + month + "/" + year;
    }

  
}