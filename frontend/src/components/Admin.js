import React from "react";

class Admin extends React.Component{
    state = {
        profileObj: this.props.location.state.profileObj
    }
    render(){
        return (
            <div className="loginForm">
                <h2>Bonjour {this.state.profileObj.givenName}</h2>
            </div>
        )
    }
}

export default Admin;