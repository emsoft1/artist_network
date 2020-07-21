import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cool: "ffff",
        };
    }
    async componentDidMount() {
        const id = this.props.match.params.id;
        console.log("OtherProfile -> componentDidMount -> id", id);

        const { data } = await axios.get(`/user/${id}.json`);
        await this.setState({
            first: data.data[0].first,
            last: data.data[0].last,
            imageUrl: data.data[0].imgurl || "/user.png",
            bio: data.data[0].bio || "this user have no bio",
            id: id,
        });
        console.log("OtherProfile -> componentDidMount -> data", this.state.id);
    }
    render() {
        if (this.state.id) {
            return (
                <div className="otherprofile">
                    <div className="otherimgc">
                        <img src={this.state.imageUrl} className="otherimg" />
                    </div>
                    <h2 className="otherbio">
                        {this.state.first} {this.state.last} {this.state.bio}
                    </h2>
                    <FriendButton fid={this.state.id} />
                </div>
            );
        } else {
            return <div>wait for data</div>;
        }
    }
}

export default OtherProfile;
