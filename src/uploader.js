import React from "react";
import axios from "./axios";
class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btc: "button",
            props: props,
        };
        console.log("Uploader -> constructor -> props", props);
    }

    handlechange(event) {
        // console.log(
        //     "Registration -> handlechange -> event",
        //     event.target.value
        // );

        // console.log("Uploader -> handlechange -> file", file);
        // console.log("Registration -> handlechange ->  name", event.target.file);

        this.setState({
            file: this.fileUpload.files[0],
        });
    }
    componentDidMount() {
        console.log("uploader maounted ");
    }
    toggleModal() {
        this.props.toggleModal();
    }
    methodinuploder() {
        console.log("runing the mathod in upload ");
        console.log("my file ", this.state.file);

        var formData = new FormData();

        formData.append("file", this.state.file);
        // can not log the formdata and it will be empty
        var thisAxios = this;
        axios
            .post("/uploadpic", formData)
            .then(function (resp) {
                console.log("resp from post the img", resp.data[0].imgurl);

                // thisAxios.methodinuploder();
                // thisAxios.props.methodInapp(resp.data[0]);
                thisAxios.props.toggleModal();
                thisAxios.props.methodInapp(resp.data[0].imgurl);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    render() {
        return (
            <div>
                <h2> Please upload your profile picture</h2>
                {/* <h1 onClick={() => this.methodinuploder()}>to uploder</h1> */}
                <h1 onClick={() => this.toggleModal()} className="close">
                    X
                </h1>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => this.handlechange(e)}
                    ref={(ref) => (this.fileUpload = ref)}
                />
                <button
                    className={this.state.btc}
                    onClick={() => this.methodinuploder()}
                >
                    submit
                </button>
            </div>
        );
    }
}

export default Uploader;
