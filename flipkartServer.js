let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Methods", 
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
var port= process.env.PORT||2410
app.listen(port, () => console.log(`Node app listening on port ${port}!`));


let { mobilesData } = require("./mobilesData.js");
let { reviewsData } = require("./reviewsData.js");
let { pincodesData } = require("./pincodesData.js");

let cart = [];
let dealsMobile = [];
let wishlist = [];
let compare = [];
let users = [
    {
        firstname: 'Admin',
        lastname: '',
        username: 'admin1234',
        email: 'admin@gmail.com',
        password: '123456',
        phone: '123456789'
    },
    {
        firstname: 'Aayam',
        lastname: 'Saxena',
        username: 'aayam2712',
        email: 'aayamsaxena2712@gmail.com',
        password: '123456',
        phone: '9917582574'
    }
];


for(i=0; i<=100; i++) {
    let randomNum = Math.floor((Math.random() * 46) + 1);
    dealsMobile.includes(randomNum) ? "" : dealsMobile.length > 13 ? "" : dealsMobile.push(randomNum);
}

app.get("/Mobiles", function(req,res) {
    // console.log("In Get /Mobiles", req.query);
    let brand = req.query.brand;
    let ram = req.query.ram;
    let rating = req.query.rating;
    let price = req.query.price;
    let assured = req.query.assured;
    let pageCount = req.query.page ? req.query.page : 1;
    // console.log("Page Count : ",pageCount);
    let arr1 = mobilesData;

    if (brand) {
        let brandArr = brand.split(',');
        // console.log("brandArr :",brandArr);
        arr1 = arr1.filter((e) => brandArr.find((g) => g == e.brand));
        // console.log("arr1 :",arr1);
    }

    if (ram) {
        let ramArr = ram.split(',');
        // console.log("ramArr :",ramArr);
        arr1 = arr1.filter(e => ramArr.find(g => g == 6 ? g <= e.ram : g == e.ram));
        // console.log("arr1 :",arr1);
    }

    if (rating) {
        let ratingArr = rating.split(',');
        // console.log("ratingArr :",ratingArr);
        arr1 = arr1.filter(e => ratingArr.find(g => g <= e.rating));
        // console.log("arr1 :",arr1);
    }

    if (price) {
        let priceSignIndex = price.indexOf("-");
        let priceArr = price.split(',');
        console.log("priceArr :",priceArr);
        arr1 = arr1.filter((e) => priceArr.find((g) => g == 20000 ? g <= e.price : g.substring(0,priceSignIndex) <= e.price && g.substring(priceSignIndex+1) >= e.price));
        console.log("arr1 :",arr1.length);
    }

    if(assured === "true") arr1 = arr1.filter((c1) => c1.assured ? c1.assured : "");
    if(assured === "false") arr1 = arr1.filter((c1) => !c1.assured ? !c1.assured : "");


    let page = +pageCount;
    let size = 10;

    let startIndex = (page - 1) * size;
    let endIndex = 
    arr1.length > startIndex + size - 1
            ? startIndex + size -1
            : arr1.length - 1;

    let finalArr = arr1.length>size 
        ? arr1.filter((tr,index) => index >= startIndex && index <= endIndex) 
        : arr1;
    
    // console.log("startIndex :",startIndex);
    // console.log("endIndex :",endIndex);
    // console.log("total :",arr1.length);

    let total = Math.floor(arr1.length/10) + 1;
    let json = {
        array: finalArr,
        totalpage: total,
        start: startIndex,
        end: endIndex,
        totalLength: arr1.length
    }

    res.send(json);
});

app.get("/Mobiles/:id", function(req,res) {
    let id = req.params.id;
    let find = mobilesData.find((mb) => mb.id === id);
    // console.log("Find :",find);
    if (find) res.send(find);
    else res.send("No Mobile Found");
});

app.post("/Mobiles/add", function (req, res) {
    let body = req.body;
    // console.log("bodyPost product add: ",body);
    let find = mobilesData.find((m1) => m1.id == body.id);
    // console.log("Find : ", find)
    if (find) {
        res.status(400).send("Id Already Exist");
    } else {
        mobilesData.push(body);
        res.send(body);
    }
});

app.put("/Mobiles/:id", function (req, res) {
    let id = req.params.id;
    let body = req.body;
    // console.log("Putid",id);
    // console.log("Putbody",body);
    let index = mobilesData.findIndex((m1) => m1.id === id);
    if (index >= 0) {
        mobilesData[index] = body;
        res.send(body);
    } else {
        res.send("Not Found");
    }
});

app.delete("/Mobiles/:id", function (req, res) {
    let id = req.params.id;
    let index = mobilesData.findIndex((m1) => m1.id === id);
    if (index >= 0) {
        mobilesData.splice(index,1);
        res.send("Successfully deleted.");
    } else {
        res.send("Not Found");
    }
});



 
app.get("/showWishlist",function(req,res) {
    res.send(wishlist);
  })

app.post("/addWishlist",function(req,res) {
let data = req.body;
// console.log("Data :",data);
wishlist = data;
// wishlist.push(data);
})




app.get("/cart", function(req,res) {
    // console.log("get");
    res.send(cart);
});

app.post("/cart", function(req,res) {
    // console.log("post");
    let data = req.body;
    cart = data;
    // console.log("data :",data);
    // console.log("cart :",cart);
});




app.get("/compare", function(req,res) {
    // console.log("get");
    res.send(compare);
});

app.post("/compare", function(req,res) {
    // console.log("post");
    let data = req.body;
    compare = data;
    // console.log("data :",data);
    // console.log("compare :",compare);
});




app.get("/pincodes", function(req,res) {
    res.send(pincodesData);
});

app.get("/reviews", function(req,res) {
    res.send(reviewsData);
});

app.get("/deals", function(req,res) {
    let array = mobilesData.filter((mb,index) => dealsMobile.find((dm) => index === dm ? mb : "" ));
    res.send(array)
});




app.post("/addCustomer", function(req,res) {
    let obj = req.body;
    // console.log("Obj :",obj)
    let find = users.find((u1) => u1.username === obj.username);
    // console.log("Find :",find);
    if(find === undefined) {
        users.push(obj);
        res.send(users); 
    }
    else {
        res.send("User Already Present");
    }
});

app.post("/login", function (req, res) {
    // console.log("LOgin");
    // console.log("body : ",req.body);
    let user = users.find((u1) => (u1.email === req.body.email || u1.phone === req.body.email) && u1.password === req.body.password);
    // console.log(user);
    let resObj = null;
    if (user != undefined) {
        resObj = {
            // id: user.id,
            firstname: user.firstname,
        };
        // console.log("resobj :",resObj);
        res.status(200).send(resObj);
    } 
    else res.status(500).send("Login Unsuccessful");
  });

 