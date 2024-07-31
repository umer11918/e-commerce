import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const navigate = useNavigate();
 useEffect(() =>
{
    const auth = localStorage.getItem("user");
    if(auth)
    {
        navigate('/')
    }
},[])

 const handleSignUp = ()=>{
  navigate('/signup');
 }
  const handleLogin= async()=>{
    let result = await fetch( ("http://localhost:5000/login"),{
        method: 'post',
        body : JSON.stringify({email,password}),
        headers:{
            'Content-Type': 'application/json'
        }
    });
    result = await result.json();
    console.log(result);
    if(result.auth){
        localStorage.setItem("user",JSON.stringify(result.user));
        localStorage.setItem("token",JSON.stringify(result.auth));
        navigate('/');
    }
    else{
        alert("please enter correct fields");
    }
  }

    return (
    <div className="product-list">
      <h1>Login</h1>
      <div className="form">
          <input type="text"
            onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email"></input>
        
          <input type="password"
          onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password"></input>
       
       <div style={{display:"flex"}}>

        <div>
          <button onClick={handleLogin} className="button">Log In</button>
        </div>
        <div>
          <button onClick={handleSignUp} className="button">Sign Up</button>
        </div>
       </div>
      </div>
    </div>
  );
};
export default Login;
