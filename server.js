const { createClient } = require("redis");
const express = require("express");
const generateUniqueId = require("generate-unique-id");
const app = express();
const PORT = 2000;


app.use(express.json());
app.get("/", (req, res) => {
	res.send("hello");
});

app.post("/createTodo", async (req, res) => {
	const data = req.body;
    const userId = data.userId
	const item = data.item
	const client = createClient();
	await client.connect();
	client.on("error", (err) => console.log("Redis Client Error", err));
    const tasksKey = await client.hGet(userId, "tasksKey")
    console.log(tasksKey)

	const response = await client.rPush(tasksKey, item);
	// const savedValue = await client.get(uniqueId);

    console.log(response)

	res.status(201).send("Task Saved Successfully");
});


//This api call is deprecated since all todo items are now associated with a specific user
// app.get("/getTodo", async (req, res) => {
// 	const userId = req.body.userId;
// 	const client = createClient();

// 	await client.connect();
// 	client.on("error", (err) => console.log("Redis Client Error", err));

//     const tasksKey = await client.hGet(userId, "tasksKey")
//     console.log(tasksKey)
// 	const response = await client.lRange(tasksKey, 0, -1)

// 	res.send(response);
// });


//Below api call returns all to do items for a user
app.get("/getAllTodos", async(req, res) =>{
    const userId = req.body.userId;
	const client = createClient();

	await client.connect();
	client.on("error", (err) => console.log("Redis Client Error", err));

    const tasksKey = await client.hGet(userId, "tasksKey")
    console.log(tasksKey)
	const response = await client.lRange(tasksKey, 0, -1)

	res.send(response);

})

app.post('/createUser',async (req,res)=>{
    const data = req.body
    console.log(data.firstName)
    const client = createClient();
	await client.connect();
	client.on("error", (err) => console.log("Redis Client Error", err));
    const userId = 'User-' + generateUniqueId()
    await client.hSet(userId, "firstName", data.firstName)
    await client.hSet(userId, "lastName", data.lastName)
    await client.hSet(userId, "tasksKey", generateUniqueId())
    let savedValue = await client.hGetAll(userId)
    savedValue["userId"] = userId
    res.send(savedValue)
})



app.get('/getUser',async(req,res)=>{
    const userId = req.body.userId
    const client = createClient();
	await client.connect();
	client.on("error", (err) => console.log("Redis Client Error", err));
    const savedValue = await client.hGetAll(userId)
    res.send(savedValue)
})

app.listen(2000, async () => {
	console.log("Server live on port" + PORT);
});


