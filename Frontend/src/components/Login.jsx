import React from 'react'
import { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { useToast } from '../context/notification/ToastContext'
import API_URL from '../config/api'
function Login(props) {
  const {notify} = useToast();
  let navigate = useNavigate()
  const [creditianls, setcreditianls] = useState({email:"",password:""})
  const handleLogin = async (event) => {
    event.preventDefault()
    let response = await fetch(`${API_URL}/auth/login`,{
      method : "POST",
      headers : {
        "Content-Type":"application/json",
      },
      body : JSON.stringify({email:creditianls.email,password:creditianls.password})
    })
    const json = await response.json()
    console.log(json)
    if (json.success) {
      // props.showAlert("log in Successfull","success")
      notify("Log in successful","success");
      navigate("/")
      localStorage.setItem("authToken",json["authToken"])
      localStorage.setItem("email",creditianls.email)
    }
    else {
      notify("Invalid log in attempt","warning")
    }
  }

  const handleonChange = (event) => {
    setcreditianls({...creditianls,[event.target.name]:event.target.value})
  }
  return (
    <>
    <div className="container">
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">Email</label>
        <input type="email" className="form-control" id="email" name='email' placeholder="name@example.com" style={{width:"300px"}} value={creditianls.email} onChange={handleonChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">Password</label>
        <input type="password" className="form-control" id="password" name='password' style={{width:"300px"}} value={creditianls.password} onChange={handleonChange}/>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleLogin}>Log In</button>
    </div>
    </>
  )
}

export default Login