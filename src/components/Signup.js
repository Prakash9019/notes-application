import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

  const [credentials, setCredentials] = useState({username:"" ,email: "", password: "",cpassword:""}) 
  let navigate = useNavigate();
   const diffToast = ()=>{
      toast("Registered Successfully");
   }
  const handleSubmit = async (e) => {
      e.preventDefault();
      const {username,email,password} = credentials;
      const response = await fetch("https://notes-application-a7e9hd5dg-surya-prakashs-projects-7fb03da7.vercel.app/api/auth/user", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({username,email,password})
      });
      const json = await response.json()
      console.log(json);
          // Save the auth token and redirect
          localStorage.setItem('jwtData', json.jwtData); 
          console.log(json.jwtData);
          navigate("/");
  }

  const onChange = (e)=>{
      setCredentials({...credentials, [e.target.name]: e.target.value})
  }


  return (
    <div className='container mt-3'>
      <h2 className="my-3">Create an account to use Notebook</h2>
      <form onSubmit={handleSubmit}>
      <div className="my-3">
    <label htmlFor="name">Name</label>
    <input type="name" className="form-control" id="username" name="username" onChange={onChange} aria-describedby="emailHelp" placeholder="Enter name" />
  </div>
  <div className="mb-3">
    <label htmlFor="email">Email address</label>
    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} placeholder="Enter email" />
  </div>
  <div className="mb-3">
    <label htmlFor="password">Password</label>
    <input type="password" className="form-control" id="password" name="password" onChange={onChange} placeholder="Password" />
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword">Confirm Password</label>
    <input type="cpassword" className="form-control" id="cpassword" name="cpassword" onChange={onChange} placeholder="Confirm Password" />
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" onChange={onChange} id="check me out" />
    <label className="form-check-label" htmlFor="check me out">Check me out</label>
  </div>
  <button type="submit" className="btn btn-primary" onClick={diffToast}>Submit</button>
</form>
    </div>
  )
}

export default Signup
