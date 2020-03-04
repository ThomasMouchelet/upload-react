import React from "react";
import GoogleLogin from 'react-google-login';

class Login extends React.Component{
    render(){
        const responseGoogle = (response) => {
          console.log(response);
          this.props.history.push({
            pathname: '/admin',
            state: { profileObj: response.profileObj }
            })
        }
        return (
            <div className="loginForm">
                <GoogleLogin
                    clientId="11717529596-3jltgpsg2lji7qslj986mnligtfen11h.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                    buttonText="LOGIN WITH GOOGLE"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                />
            </div>
        )
    }
}

export default Login;