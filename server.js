const figlet = require('figlet');



figlet("Employee Management", function (err, data)  {
    if (err)    {
        console.error("Something went wrong..." + err);
        return;
    }
    console.log(data);
});
