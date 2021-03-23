import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import './Login.css'
import URL from '../../baseUrl/BaseUrl'
import { useGlobalState, useGlobalStateUpdate } from '../../context/globalContext'
import {
    useHistory
} from "react-router-dom";

function Login() {
    let [show, setShow] = useState()
    let history = useHistory()
    const globalState = useGlobalState()
    const setGlobalState = useGlobalStateUpdate()
    function login(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: URL + '/login',
            data: {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            },
            withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                setGlobalState(prev => ({
                    ...prev,
                    loginStatus: true,
                    user: response.data.user,
                    role: response.data.user.role,
                }))
            }
            else {
                history.push("/login");
                setShow(response.data.message)
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    function goToForget() {
        history.push("/forgetpw");
    }
    return (
       
        <div className="body">
        <div>
            
      <form onSubmit={login}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" required />
          <small id="passwordHelp" className="form-text text-muted">We'll never share your password with anyone else.</small>
        </div>
        
        <div className="col">
        <button type="submit" className="btn btn-primary" style = {{marginLeft : "30px"}}>Login</button>
        <p className='mt-3' onClick={goToForget}
                                        style={{ cursor: "pointer" , margin:"30px" }}>Forget Password</p>
                              </div><br />
                             {show ? <div className="alert alert-danger" role="alert">
                               {show}
                              </div> : null}
    
       
      </form>
      </div>
        </div>
    )
}

export default Login