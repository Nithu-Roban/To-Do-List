const User = require('../model/userModel');
const ToDo = require('../model/Todo');


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

        res.redirect('/home');
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

const loadAddTask = async(req,res)=>{
    try{
        const project = req.query.project;
        const existingProject = await ToDo.findOne({projectName: project})
        if(existingProject){
            return res.render('addTasks',{projectdata:project})
        }
                
        const projectData = new ToDo({
            projectName:project
          
        })
        
        const projectdata= await projectData.save();
        console.log(projectdata);
        
        res.render('addTasks',{projectdata})
    }catch(error){
        console.log(error.message)
    }
}


const loadViewTasks = async(req,res)=>{
try{
    const project = "project 1";
    const todoList = await ToDo.find({projectName:project});
    
    const status = "completed";
    const todoCompletedList = await ToDo.find({projectName:project,status:status})

    res.render('viewTasks', {todoList,todoCompletedList})
}catch(error){
    console.log(error.message)
}
   
}


const loadTaskUpdate = async(req,res)=>{
    try{
        const task= req.query.task;
        const project = req.query.project;
        

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
        res.redirect('/home')
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
    loadverifyUpdateTask

}