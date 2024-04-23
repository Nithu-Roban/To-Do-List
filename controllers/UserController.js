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



const AddTodo = async(req,res)=>{
    try{

        const task = req.body.task;

        const existingtask = await ToDo.findOne({task: task})
        if(existingtask){
            return res.status(400).json({ message: "task already exists." });
        }
        

        const TodoData = new ToDo({
            
           task:task
            
        })

        const Tododata= await TodoData.save();
        console.log(Tododata);
        
        res.redirect('/home');

    }catch(error){
        console.log(error.message);
    }
}








module.exports={
    loadLogin,
    loadRegister,
    loadVerifyRegister,
    loadVerifyLogin,
    loadHome,
    AddTodo
}