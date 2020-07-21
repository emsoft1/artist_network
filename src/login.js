import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
var validator = require("email-validator");
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { bte: true, btc: "buttond" };
    }
    handlechange(event) {
        // console.log(
        //     "Registration -> handlechange -> event",
        //     event.target.value
        // );
        // console.log("Registration -> handlechange ->  name", event.target.name);
        console.log("this namve ", this.state.namev);

        this.setState(
            {
                [event.target.name]: event.target.value,
            },
            // console.log("this..state ", this.state)
            () => {
                if (this.state.pass && validator.validate(this.state.email)) {
                    this.setState({
                        bte: false,
                        btc: "button",
                    });
                } else {
                    this.setState({
                        bte: true,
                        btc: "buttond",
                        error: true,
                    });
                }
            }
        );
    }
    submit() {
        console.log("submiting baby");
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                console.log(data);
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("reg error", err);
            });
    }
    render() {
        return (
            <div>
                <h2>This is the Registey page </h2>
                <h3>
                    <Link to="/">Regisretation</Link>
                </h3>
                <h3>
                    <Link to="/resetpass">Forget password</Link>
                </h3>
                <h3>
                    We are happy to meet you {this.state.first}{" "}
                    {this.state.last}
                    {this.state.error && (
                        <div> the email or password is wrong! </div>
                    )}
                </h3>

                <div className="form">
                    <input
                        name="email"
                        type="email"
                        placeholder="email"
                        onChange={(e) => this.handlechange(e)}
                    />
                    <input
                        name="pass"
                        placeholder="password"
                        type="password"
                        onChange={(e) => this.handlechange(e)}
                    />
                    <button
                        className={this.state.btc}
                        disabled={this.state.bte}
                        onClick={() => this.submit()}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }
}

export default Login;
