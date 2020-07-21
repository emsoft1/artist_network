import React from "react";
import axios from "./axios";
import Profilepic from "./profilepic";
import Profile from "./profile";
import Uploader from "./uploader";
import { BrowserRouter, Route, Link } from "react-router-dom";
import OtherProfile from "./otherprofile";
import Searchlist from "./search";
import FirendStatus from "./firendstatus";
import Chat from "./chat";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "mehrdad",
            last: "mansouri",
            uploaderIsvis: false,
            imageUrl: "",
        };
    }
    async changeBio(arg) {
        await this.setState({
            bio: arg,
        });
        console.log("App -> changeBio -> bio", this.state);
    }
    toggleModal() {
        this.setState({
            uploaderIsvis: !this.state.uploaderIsvis,
        });
    }
    async methodInapp(arg) {
        console.log("i am run in app ");
        console.log("arg", arg);
        await this.setState({
            imageUrl: arg,
        });
        console.log("check the url in app", this.state.imageUrl);
    }
    async componentDidMount() {
        // console.log("app mounted ");
        var thisAxios = this;
        try {
            const resp = await axios.get("/getdata");
            console.log("resp from post the img", resp.data.data[0].first);
            await thisAxios.setState({
                first: resp.data.data[0].first,
                last: resp.data.data[0].last,
                imageUrl: resp.data.data[0].imgurl,
                bio: resp.data.data[0].bio,
            });
            console.log("check the url in app in mount", this.state);
        } catch (err) {
            console.log("err in app request for user data ", err);
        }
    }
    render() {
        return (
            <div className="welmain">
                <BrowserRouter>
                    <h1 className="title">AI Art Center </h1>
                    <div className="headlink">
                        <Link to="/search" className="links">
                            Search
                        </Link>
                        <Link to="/chat" className="links">
                            Chat
                        </Link>
                        <Link to="/friends" className="links">
                            Friends
                        </Link>
                        <a href="/logout" className="links">
                            Logout
                        </a>
                    </div>
                    <div className="logcon">
                        <Link to="/">
                            <div id="Capa_1"></div>
                            <svg
                                id="Capa_2"
                                height="512"
                                viewBox="0 0 512 512"
                                width="512"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g>
                                    <g>
                                        <circle cx="116" cy="316" r="15" />
                                        <circle cx="116" cy="196" r="15" />
                                        <circle cx="196" cy="411" r="15" />
                                        <circle cx="196" cy="101" r="15" />
                                        <path d="m308.271 334.838c-5.514-8.576-11.215-17.445-16.374-26.228-19.061-32.451-19.061-72.77 0-105.221 5.159-8.782 10.86-17.651 16.374-26.228 15.558-24.201 30.252-47.06 35.635-70.816 6.571-28.998-2.582-54.509-27.208-75.823-16.794-14.535-37.528-24.355-59.962-28.399-21.613-3.899-44.407-2.393-65.915 4.353-49.259 15.443-93.637 48.007-124.961 91.694-32.619 45.495-49.86 100.071-49.86 157.83s17.241 112.335 49.86 157.83c31.323 43.687 75.702 76.251 124.961 91.694 13.71 4.299 27.938 6.469 42.053 6.469 8.029 0 16.025-.703 23.862-2.116 22.434-4.044 43.168-13.864 59.961-28.399 24.626-21.314 33.779-46.825 27.208-75.823-5.383-23.758-20.077-46.616-35.634-70.817zm-192.271-183.838c24.813 0 45 20.187 45 45s-20.187 45-45 45-45-20.187-45-45 20.187-45 45-45zm0 210c-24.813 0-45-20.187-45-45s20.187-45 45-45 45 20.187 45 45-20.187 45-45 45zm80 95c-24.813 0-45-20.187-45-45s20.187-45 45-45 45 20.187 45 45-20.187 45-45 45zm0-310c-24.813 0-45-20.187-45-45s20.187-45 45-45 45 20.187 45 45-20.187 45-45 45z" />
                                    </g>
                                    <g>
                                        <g>
                                            <path d="m478.202 63.99-32.247-56.432c-2.671-4.673-7.64-7.558-13.023-7.558s-10.353 2.885-13.023 7.558l-32.248 56.432c-9.328 16.324-9.264 35.778.174 52.04 2.377 4.096 5.242 7.756 8.473 10.97h73.247c3.232-3.214 6.096-6.874 8.473-10.97 9.438-16.261 9.503-35.716.174-52.04z" />
                                        </g>
                                        <path d="m374.33 242h117.205l4.318-46.783c.902-9.777-2.374-19.546-8.99-26.801s-16.042-11.416-25.862-11.416h-56.138c-9.819 0-19.246 4.161-25.862 11.416s-9.893 17.023-8.99 26.801z" />
                                        <path d="m377.099 272 19.059 206.463c1.763 19.119 17.573 33.537 36.774 33.537 19.2 0 35.01-14.417 36.775-33.536l19.058-206.464z" />
                                    </g>
                                </g>
                            </svg>
                        </Link>
                    </div>

                    <div onClick={() => this.toggleModal()} className="headpic">
                        <Profilepic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            size="s"
                        />
                    </div>

                    {this.state.uploaderIsvis && (
                        <div className="uploder">
                            <Uploader
                                methodInapp={(arg) => this.methodInapp(arg)}
                                toggleModal={() => this.toggleModal()}
                            />
                        </div>
                    )}

                    <Route
                        path="/"
                        exact
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                bio={this.state.bio}
                                changeBio={(arg) => this.changeBio(arg)}
                            />
                        )}
                    ></Route>

                    <Route component={OtherProfile} path="/user/:id"></Route>

                    <Route component={Searchlist} path="/search"></Route>
                    <Route component={FirendStatus} path="/friends"></Route>
                    <Route component={Chat} path="/chat"></Route>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
