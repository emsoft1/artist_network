import React from "react";
import Name from "./Name";

export default class Helloworld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "mehrdad",
        };
    }
    componentDidMount() {
        this.setState(
            {
                first: "mansouri",
            },
            () => console.log(this.state)
        );
    }

    handleclick() {
        this.setState({
            first: "vanilla",
        });
    }
    render() {
        return (
            <div className="container ">
                <p>helloo World !!!!(with class ) {this.state.first}</p>
                <p onClick={() => this.handleclick()}>
                    click on to change text
                </p>
                <Name first={this.state.first} />
            </div>
        );
    }
}

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
