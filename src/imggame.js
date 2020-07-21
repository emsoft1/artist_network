import React from "react";
import axios from "./axios";

import { socket } from "./socket";
class Imggame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btc: "button",
            mixedimg: "packet.png",
            // props: props,
        };
        console.log("image game  -> constructor -> props", props);
    }

    async handlechange(e) {
        await this.setState({
            file: this.fileUpload.files[0],
        });
        console.log("file in game in 1st", this.state.file);
    }
    componentDidMount() {
        const _this = this;
        (async function () {
            try {
                const mixedimg = await axios.post("/imggame", {
                    fid: _this.props.fid,
                });
                console.log("resp from post the img", mixedimg.data);
                // thisAxios.methodinuploder();
                // thisAxios.props.methodInapp(resp.data[0]);
                // thisAxios.props.toggleModal();
                // thisAxios.props.methodInapp(resp.data[0].imgurl);
                if (mixedimg.data != "") {
                    await _this.setState({
                        mixedimg:
                            mixedimg.data.rows[0].final_img || "hourglass.png",
                    });
                }
            } catch (err) {
                console.log(err);
            }
        })();
        console.log("uploader maounted ", _this.props);

        // Init chart with data from props.
    }
    // componentWillReceiveProps(props) {
    //     console.log("props", props);
    // }

    async read() {
        console.log("uploader maounted ", this.props);
    }
    async methodinuploder() {
        console.log("runing the mathod in upload ");
        console.log("my file ", this.state.file);

        var formData = new FormData();

        formData.append("file", this.state.file);
        formData.append("fid", this.props.fid);
        // can not log the formdata and it will be empty
        var thisAxios = this;
        // socket.emit("img from game", "/user.png ");
        try {
            const mixedimg = await axios.post("/imggameu", formData);

            console.log("resp from post the img", mixedimg.data);
            // thisAxios.methodinuploder();
            // thisAxios.props.methodInapp(resp.data[0]);
            // thisAxios.props.toggleModal();
            // thisAxios.props.methodInapp(resp.data[0].imgurl);
            await this.setState({
                mixedimg: mixedimg.data.final_img || "hourglass.png",
            });
        } catch (err) {
            console.log(err);
        }
    }
    render() {
        return (
            <div className="usergame">
                <h2> Please upload your profile picture</h2>

                <div className="profilelogog">
                    <img src={this.state.mixedimg} className="profilepicsg" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => this.handlechange(e)}
                        ref={(ref) => (this.fileUpload = ref)}
                    />
                </div>
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

export default Imggame;
