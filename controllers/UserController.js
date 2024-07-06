const User = require('../model/userModel');
const ToDo = require('../model/Todo');
const { Parser } = require('json2csv');

const loadLogin = async(req,res)=>{
    try{
        res.render("login");
    }catch(error){
        console.log(error.message);
    }
}


const loadVerifyLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const pass = req.body.pass;
        const isValidUser = await User.findOne({email:email, pass:pass});
        if(isValidUser){  
            console.log("Login Successful")
            res.redirect('/home')
           
            
        }
        else{
            console.log("Login Failed: User not found");
            
            res.redirect('/');
        }
    } catch(error){
        console.log(error.message)
    }
}

const loadRegister = async(req,res)=>{
    try{
        res.render('Register');
    }catch(error){
        console.log(error.message);
    }
}


const loadVerifyRegister = async(req,res)=>{
    try{

        const email = req.body.email;
        const {uname,pass}= req.body;
        const existingUser = await User.findOne({email: email})
        if(existingUser){
            return res.status(400).json({ message: "User with this email already exists." });
        }
        

        const userData = new User({
            
            email:email,
            uname:uname,
            pass:pass
            
        })

        const userdata= await userData.save();
        console.log(userdata);
        
        res.redirect('/');

    }catch(error){
        console.log(error.message);
    }

}



const loadHome = async(req,res)=>{
    try{
        
        res.render('home');
    }catch(error){
        console.log(error.message);
    }
}


// add new task to the project
const load_addNewProject = async (req, res) => {
    try {
        const projectName = req.body.project;
        const task = req.body.task;
        const desc = req.body.desc;
        const status = req.body.status;

        // Find the project by its name
        const existingProject = await ToDo.findOne({ projectName: projectName });

        // Check if the task already exists for that project
        const existingTask = existingProject.newTasks.find(t => t.task === task);
        if (existingTask) {
            return res.status(400).json({ message: "Task already exists." });
        }

        // If the task doesn't exist, push the new task into the newTasks array
        existingProject.newTasks.push({ task: task, desc: desc, status: status });

        // Save the updated project back to the database
        await existingProject.save();

        res.redirect('/add-project');
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}

// navigating to new project

const loadnewProject = async(req,res)=>{
    try{
        
        res.render('newProject')
    }catch(error){
        console.log(error.message)
    }
}



// add task page load

const loadAddTask = async (req, res) => {
    try {
        const project = req.query.project;
        const existingProject = await ToDo.findOne({ projectName: project });
        if (existingProject) {
            return res.render('addTasks', { projectdata: project });
        }

        const projectData = new ToDo({
            projectName: project
        });

        const projectdata = await projectData.save();
        console.log(projectdata);

        res.render('addTasks', { projectdata });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};



const loadViewTasks = async(req,res)=>{
    try {
        
        const project = "my project";

        // Fetch all tasks for the project
        const todoList = await ToDo.find({ projectName: project });

        // Filter completed tasks within the todoList
        const todoCompletedList = todoList.flatMap(proj => proj.newTasks.filter(task => task.status === "completed"));

        // Render viewTasks.ejs template with todoList and todoCompletedList
        res.render('viewTasks', { todoList, todoCompletedList });
    } catch (error) {
        console.log(error.message);
    }
   
}


const loadTaskUpdate = async(req,res)=>{
    try{
        const {task}= req.query;
        const project = req.query.project;
        
        console.log(task)
        const upTask = await ToDo.findOne({projectName:project,"newTasks.task":task})
        // console.log(task, project)
        res.render('updateTask',{project:project,upTask:task})
    }catch(error){
        console.log(error.message)
    }
}


// updating query not completed

const loadverifyUpdateTask= async(req,res)=>{
    try{
        const task = req.body.task;
        const desc= req.body.desc;
        const status = req.body.status;
        console.log(task,desc,status)
        const project = "my project";

        // updating the db

       const updatedTask= await ToDo.updateOne({projectName:project, "newTasks.task": task},{
            $set:{
                "newTasks.$.task": task,
                "newTasks.$.desc": desc,
                "newTasks.$.status":status,
                "newTasks.$.updatedDate": new Date()
            }
        });

        console.log(updatedTask);
        res.redirect('/add-project');
    }catch(error){
        console.log(error.message)
    }
}

// remove the task 

const loadRemoveTask = async(req,res)=>{
    try {
        const {project, task} = req.query;
        const removedTask = await ToDo.updateOne({projectName:project},{
            $pull:{newTasks:{task:task}}
        });

        console.log(removedTask);
        res.redirect('/viewTasks')

    } catch (error) {
        console.log(error.message);
    }

}


const loadListCount= async(req,res)=>{
    try {
        // const pending = await ToDo.countDocuments({"projectName":"my project","newTasks.status":"pending"});
        // const completed = await ToDo.countDocuments({"projectName":"my project","newTasks.status":"completed"})

        const result = await ToDo.aggregate([
            { $match: { projectName:"my project" } },
            { $unwind: "$newTasks" },
            { $group: { _id: "$newTasks.status", count: { $sum: 1 } } }
        ]);

        const counts = result.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});

        const pending = counts['pending'] || 0;
        const completed = counts['completed'] || 0;

        console.log(`pending : ${pending}`);
        res.render('couunts',{pending, completed});
        
    } catch (error) {
       console.log(error.message); 
    }
}

const loadDownloadFile = async(req,res)=>{
    try{
        const projectName = "my project";

        const result = await ToDo.aggregate([
            { $match: { projectName } },
            { $unwind: "$newTasks" },
            { $group: { _id: "$newTasks.status", count: { $sum: 1 } } }
        ]);

        const counts = result.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});
        const taskDetails = await ToDo.find({projectName:"my project"});
        console.log(taskDetails);


        let tabularText = `Project Name: ${projectName}\n\n`;
        tabularText += `Task\t\tDescription\t\tStatus\t\tCreated Time\t\tUpdated Time\n`;

        taskDetails.forEach(project => {
            project.newTasks.forEach(task => {
                tabularText += `${task.task}\t\t${task.desc}\t\t${task.status}\t\t${task.date}\t\t${task.updatedDate}\n`;
            });
        });

        // Add status counts to the text file
        tabularText += `\nStatus\t\tCount\n`;
        const pending = counts['pending'] || 0;
        const completed = counts['completed'] || 0;
        tabularText += `Pending\t\t${pending}\n`;
        tabularText += `Completed\t${completed}\n`;
        // const tasks = [];
        // taskDetails.forEach(project => {
        //     project.newTasks.forEach(task => {
        //         tasks.push({
        //             projectName: project.projectName,
        //             task: task.task,
        //             desc: task.desc,
        //             status: task.status,
        //             date: task.date,
        //             updatedDate: task.updatedDate
        //         });
        //     });
        // });

        // // Convert JSON to CSV
        // const fields = ['projectName', 'task', 'desc', 'status', 'date', 'updatedDate'];
        // const json2csvParser = new Parser({ fields });
        // let csv = json2csvParser.parse(tasks);

      


        // const pending = counts['pending'] || 0;
        // const completed = counts['completed'] || 0;

        // csv += `\n\nStatus Counts\n`;
        // csv += `Status,Count\n`;
        // csv += `Pending,${pending}\n`;
        // csv += `Completed,${completed}\n`;

        // const textContent = `Project Name: my project\n\n`;
        // const statusTable = `Status\t\tCount\n`;
        // const pendingRow = `Pending\t\t${pending}\n`;
        // const completedRow = `Completed\t${completed}\n`;

        // const tabularText = textContent + statusTable + pendingRow + completedRow;
        // const csvContent = `Project Name:\tmy project\n Status \t Count\nPending:\t${pending}\nCompleted:\t${completed}\n`;

        res.header('Content-Type', 'text/csv');
        res.attachment('task_counts.txt');
        return res.send(tabularText);
    }catch(error){
        console.log(error.message);
    }
}


const loadSort = async(req,res)=>{

    try{
        const project = req.query.projectName;
        const sortBy = req.query.sortBy;
        console.log(`project : ${project}, sortBy : ${sortBy}`);

        // const sortOrder = sortBy === 'desc' ? -1 : 1;
        let sortOrder = 1; // Default to ascending order
        if (sortBy === 'desc') {
            sortOrder = -1; // Change to descending order if sortBy is 'desc'
        }
        // const TodoList = await ToDo.find({ projectName:"my project" }).sort({ "newTasks.task": sortOrder }).exec();
        
        const todoList = await ToDo.find({ projectName: project })
        .sort({ "newTasks.task": sortOrder })
        .exec();

// Filter completed tasks within the todoList (optional)
const todoCompletedList = todoList.flatMap(proj => proj.newTasks.filter(task => task.status === "completed"));

// Render viewTasks.ejs template with sorted todoList and todoCompletedList
res.redirect('/viewTasks', { todoList, todoCompletedList });
        // console.log(TodoList);
        // res.redirect('/viewTasks',{TodoList});

    }catch(error){
        console.log(error.message)
    }
}

module.exports={
    loadLogin,
    loadRegister,
    loadVerifyRegister,
    loadVerifyLogin,
    loadHome,
    load_addNewProject,
    loadnewProject,
    loadAddTask,
    loadViewTasks,
    loadTaskUpdate,
    loadverifyUpdateTask,
    loadRemoveTask,
    loadListCount,
    loadDownloadFile,
    loadSort

}