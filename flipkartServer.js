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
        firstname: 'Aayam',
        lastname: 'Saxena',
        username: 'aayam2712',
        email: 'aayamsaxena2712@gmail.com',
        password: '123456',
        phone: '9917582574'
    }
];
// console.log("dealsMobile before :", dealsMobile);
for(i=0; i<=100; i++) {
    let randomNum = Math.floor((Math.random() * 46) + 1);
    // console.log("randomNum :", randomNum);
    dealsMobile.includes(randomNum) ? "" : dealsMobile.length > 13 ? "" : dealsMobile.push(randomNum);
}
// console.log("dealsMobile :", dealsMobile);

app.get("/reviews", function(req,res) {
    res.send(reviewsData);
});

app.get("/deals", function(req,res) {
    let array = mobilesData.filter((mb,index) => dealsMobile.find((dm) => index === dm ? mb : "" ));  
    // console.log("Array :", array);
    res.send(array)
});

app.get("/Mobiles/:prodId", function(req,res) {
    let prodId = req.params.prodId;
    let find = mobilesData.find((mb) => mb.id === prodId);
    console.log("Find :",find);
    if (find) res.send(find);
    else res.send("No Mobile Found");
});

app.get("/Mobiles", function(req,res) {
    console.log("In Get /Mobiles", req.query);
    let assured = req.query.assured;
    // console.log("assured :",assured);
    let ram = req.query.ram;
    let rating = +req.query.rating;
    let price = req.query.price;
    let sortBy = req.query.sortBy;
    let page = req.query.page;
    let arr1 = mobilesData;
    if(assured === "true") arr1 = arr1.filter((c1) => c1.assured ? c1.assured : "");
    if(assured === "false") arr1 = arr1.filter((c1) => !c1.assured ? !c1.assured : "");
    if(ram) arr1 = arr1.filter((pd) => pd.ram === ram);
    if(rating) arr1 = arr1.filter((c1) => c1.rating > rating);
    if(price) {
        let priceSignIndex = price.indexOf("-");
        let price1 = +price.substring(0,priceSignIndex);
        let price2 = +price.substring(priceSignIndex+1);
        arr1 = arr1.filter((c1) => c1.price > price1 && c1.price <= price2 );
    }
    if(sortBy) {
        if(sortBy === "asc") arr1.sort((c1,c2) => c1.price-c2.price);
        else if(sortBy === "desc") arr1.sort((c1,c2) => c2.price-c1.price);
        else if(sortBy === "popularity") arr1.sort((c1,c2) => c1.popularity-c2.popularity);
        else arr1 = "Enter Valid Value";
    }
    res.send(arr1);
});


 
app.get("/showWishlist",function(req,res) {
    res.send(wishlist);
  })

app.post("/addWishlist",function(req,res) {
let data = req.body;
console.log("Data :",data);
wishlist = data;
// wishlist.push(data);
})


app.get("/cart", function(req,res) {
    console.log("get");
    res.send(cart);
});

app.post("/cart", function(req,res) {
    console.log("post");
    let data = req.body;
    cart = data;
    console.log("data :",data);
    console.log("cart :",cart);
});


app.get("/compare", function(req,res) {
    console.log("get");
    res.send(compare);
});

app.post("/compare", function(req,res) {
    console.log("post");
    let data = req.body;
    compare = data;
    console.log("data :",data);
    console.log("compare :",compare);
});











// app.put("/cart", function (req, res) {
//     console.log("put");
//     let obj = req.body;
//     // console.log(id);
//     // console.log(obj);
//     let index1 = cart.findIndex((obj1) => obj1.id === obj.id);
//     if(obj.count === 1) cart.splice(index1,1);
//     if (index1 !== -1) {
//         cart[index1] = obj;
//         res.send(obj);
//         console.log(cart[index1].count);
//     } else {
//         res.send("Not Found");
//     }
//     console.log("cart :",cart);
// });



app.get("/pincodes", function(req,res) {
    res.send(pincodesData);
});



app.post("/addCustomer", function(req,res) {
    let obj = req.body;
    console.log("Obj :",obj)
    let find = users.find((u1) => u1.username === obj.username);
    console.log("Find :",find);
    if(find === undefined) {
        users.push(obj);
        res.send(users); 
    }
    else {
        res.send("User Already Present");
    }
});



app.post("/login", function (req, res) {
    console.log("LOgin");
    console.log("body : ",req.body);
    let user = users.find((u1) => (u1.email === req.body.email || u1.phone === req.body.email) && u1.password === req.body.password);
    console.log(user);
    let resObj = null;
    if (user != undefined) {
        resObj = {
            // id: user.id,
            firstname: user.firstname,
        };
        console.log("resobj :",resObj);
        res.status(200).send(resObj);
    } 
    else res.status(500).send("Login Unsuccessful");
  });

 