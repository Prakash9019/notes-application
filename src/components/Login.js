import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""}) 
    let navigate = useNavigate();
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("https://notes-application-api-pi.vercel.app/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
     //   console.log(json);
      //  console.log(json.sucess);
        if (json.sucess){
            toast("Login Successfully");
            // Save the auth token and redirect
            localStorage.setItem('jwtData', json.jwtData); 
            console.log(json.jwtData);
            navigate("/");

        }
        else{
           // console.log(response);
            toast(json.errors[0].msg);
            
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='mt-3'>
            <h3>Login to Continue in NoteBook</h3>
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
                </div>

                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login
