import React from "react";
// export default function Name(props) {
//     console.log("Name -> props", props);
//     return <p> Welcome {props.first}</p>;
// }
export default class Name extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("Name -> render -> this.props.first", this.props.first);
        return <h1>Welcome {this.props.first} class style</h1>;
    }
}
