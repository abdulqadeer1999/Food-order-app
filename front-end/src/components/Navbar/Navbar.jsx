import React from "react";
import { Link } from 'react-router-dom'
import { useGlobalState } from '../../context/globalContext'
import Logout from './logout'
import './Navbar.css'

function Navbar() {
    const globalState = useGlobalState()
    return (
        <div className='sticky-top' >
            <nav className="navbar  navbar-expand-lg navbar-light bg-light">
                <img src ="https://i.pinimg.com/originals/03/45/df/0345df122c914f3670b3a4214b7c18f1.jpg" width = "100px" height ="70px" />
               
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                    {globalState.role === 'user' ?
                        <>
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/">Dashboard <span className="sr-only">(current)</span></Link>
                                </li>
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/myorders">My orders <span className="sr-only">(current)</span></Link>
                                </li>
                                
                            </ul>
                            <h3 className="mr-3">Welcome {globalState.user.name.charAt(0).toUpperCase() + globalState.user.name.slice(1)}</h3>
                            <Logout />
                        </> :
                        <>
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/">Admin Dashboard <span className="sr-only">(current)</span></Link>
                                </li>
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/addproducts">Add Products <span className="sr-only">(current)</span></Link>
                                </li>
                        
                
                            </ul>
                            <h3 className="mr-3">Welcome {globalState.user.name.charAt(0).toUpperCase() + globalState.user.name.slice(1)}</h3>
                            <Logout />
                        </>
                    }
                </div>
            </nav>
        </div>
    )
}
export default Navbar