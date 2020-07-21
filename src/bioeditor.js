import React from "react";
import axios from "./axios";
class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        console.log("Bioeditor -> constructor -> props", props);

        this.state = {
            mod: 1,
            bioshow: "this is thest",
            props: props,
            bio: this.props.bio,
        };
    }
    async editmod() {
        await this.setState({
            mod: 2,
        });
    }
    handlechange(event) {
        // console.log(
        //     "Registration -> handlechange -> event",
        //     event.target.value
        // );
        // console.log("Registration -> handlechange ->  name", event.target.name);

        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    async submit() {
        console.log("submiting baby");
        try {
            const data = await axios.post("/bioupdate", this.state);
            console.log(data.data.data[0]);
            if (data.data.data[0]) {
                this.props.changeBio(data.data.data[0].bio);
                await this.setState({
                    bio: data.data.data[0].bio,
                    mod: 1,
                });
            } else {
                this.setState({
                    error: true,
                });
            }
        } catch (err) {
            console.log("axios in bio error", err);
        }
    }
    mods() {
        if (this.state.mod == 1) {
            let bioshw =
                this.state.bio ||
                this.props.bio ||
                "there is no bio here please set one ";

            return (
                <div>
                    <h2>{bioshw}</h2>
                    <h2 onClick={() => this.editmod()}>Edit</h2>
                </div>
            );
        } else if (this.state.mod == 2) {
            return (
                <div className="bioeditorpasge2">
                    <textarea
                        type="text"
                        name="bio"
                        key="bioedit"
                        className="biotexteditor"
                        placeholder="Bio"
                        onChange={(e) => this.handlechange(e)}
                    />
                    <button className="button" onClick={() => this.submit()}>
                        Save
                    </button>
                </div>
            );
        }
    }
    render() {
        return this.mods();
    }
}

export default Bioeditor;
