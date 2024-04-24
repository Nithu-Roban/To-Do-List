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



const load_addNewProject = async(req,res)=>{
    try{

        const project = req.body.project;
        const newTasks = [];
        const task = req.body.task;
        const desc = req.body.desc;
        const status = req.body.status;
        const existingtask = await ToDo.findOne({task: task})
        if(existingtask){
            return res.status(400).json({ message: "task already exists." });
        }
        
        
       
        const TodoData = new ToDo({
            projectName:project,
           newTasks:[]
     
        })
        TodoData.newTasks.push({task,desc,status})

        const Tododata= await TodoData.save();
        console.log(Tododata);
        
        res.redirect('/home');

    }catch(error){
        console.log(error.message);
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
        res.render('addTasks',{project})
    }catch(error){
        console.log(error.message)
    }
}


const loadViewTasks = async(req,res)=>{
try{
    const project = "Project 1";
    const todoList = await ToDo.find({projectName:project});
    console.log(project)
    const status = "completed";
    const todoCompletedList = await ToDo.find({projectName:project,status:status})

    res.render('viewTasks', {todoList,todoCompletedList})
}catch(error){
    console.log(error.message)
}
   
}


const loadTaskUpdate = async(req,res)=>{
    try{
        // not completed

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
    loadTaskUpdate

}