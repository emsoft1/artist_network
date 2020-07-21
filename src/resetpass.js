import React, { Component } from "react";

import axios from "./axios";
import { Link } from "react-router-dom";
var validator = require("email-validator");

class Restpass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            bte: true,
            btc: "buttond",
        };
        // this.sendamil = this.sendamil.bind(this);
        // this.steps = this.steps.bind(this);
    }

    handlechange(event) {
        // console.log(
        //     "Registration -> handlechange -> event",
        //     event.target.value
        // );
        // console.log("Registration -> handlechange ->  name", event.target.name);

        console.log("his..state ", this.state);
        this.setState(
            {
                [event.target.name]: event.target.value,
            },
            () => {
                if (validator.validate(this.state.email)) {
                    this.setState({
                        bte: false,
                        btc: "button",
                    });
                } else {
                    this.setState({
                        bte: true,
                        btc: "buttond",
                    });
                }
            }
        );
    }
    handlechangest2(event) {
        // console.log(
        //     "Registration -> handlechange -> event",
        //     event.target.value
        // );
        // console.log("Registration -> handlechange ->  name", event.target.name);

        console.log("his..state ", this.state);
        this.setState(
            {
                [event.target.name]: event.target.value,
            },
            () => {
                if (this.state.pass && this.state.code) {
                    this.setState({
                        bte: false,
                        btc: "button",
                    });
                } else {
                    this.setState({
                        bte: true,
                        btc: "buttond",
                    });
                }
            }
        );
    }
    sendamil() {
        axios
            .post("/sendemail", this.state)
            .then(({ data }) => {
                console.log("data axios", data);
                if (data.success) {
                    this.setState({ step: 2 }, () => {
                        console.log("step here", this.state);
                    });
                } else if (data.emailIsWrong) {
                    this.setState({
                        error: true,
                    });
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
    checkthecode() {
        axios
            .post("/chechkthecode", this.state)
            .then(({ data }) => {
                console.log("data axios", data);
                if (data.success) {
                    this.setState({ step: 3 }, () => {
                        console.log("step here", this.state);
                    });
                } else if (data.codeexpire) {
                    this.setState({
                        codeexpire: true,
                    });
                } else if (data.codenotmacht) {
                    this.setState({
                        codenotmacht: true,
                    });
                }
            })
            .catch((err) => {
                console.log("reg error", err);
            });
    }
    steps() {
        if (this.state.step == 1) {
            return (
                <div>
                    <h2>This is the Registey page </h2>
                    <h3>
                        <Link to="/">Login</Link>
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

                        <button
                            className={this.state.btc}
                            disabled={this.state.bte}
                            onClick={() => this.sendamil()}
                        >
                            submit
                        </button>
                    </div>
                </div>
            );
        } else if (this.state.step == 2) {
            return (
                <div>
                    <h2>Please type the code from the email</h2>
                    <h3>
                        <Link to="/Login">Login</Link>
                    </h3>
                    <h3>
                        {this.state.error && (
                            <div> opppppss somthing is wrong </div>
                        )}
                    </h3>
                    <h3>
                        {this.state.codenotmacht && (
                            <div> the code is not match </div>
                        )}
                    </h3>
                    <h3>
                        {this.state.codeexpire && (
                            <div> the code is expierd </div>
                        )}
                    </h3>

                    <div className="form">
                        <input
                            name="code"
                            type="text"
                            placeholder="code"
                            key="code"
                            onChange={(e) => this.handlechange(e)}
                        />
                        <input
                            name="pass"
                            type="pass"
                            placeholder="New Password"
                            onChange={(e) => this.handlechange(e)}
                        />

                        <button
                            className={this.state.btc}
                            disabled={this.state.bte}
                            onClick={() => this.checkthecode()}
                        >
                            submit
                        </button>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <h2> pass changing page </h2>
                    <h3>
                        <Link to="/Login">Login</Link>
                    </h3>
                    <h3>
                        {this.state.error && (
                            <div> the email or password is wrong! </div>
                        )}
                    </h3>
                    <h2>Your password is change !</h2>
                </div>
            );
        }
    }
    render() {
        return this.steps();
    }
}

export default Restpass;
