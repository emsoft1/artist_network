import React from "react";

// class Profilepic extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             props: props,
//             imageUrl: props.imageUrl || "./user.png",
//         };
//         //console.log("img url in profile pic", props);
//     }

//     render() {
//         return (
//             <div className="profilelogo">
//                 <h4>
//                     {this.state.props.first}
//                     {this.state.props.last}
//                     <img src={this.state.imageUrl} className="profilepic" />
//                 </h4>
//             </div>
//         );
//     }
// }

// export default Profilepic;
export default function Profilepic({ first, last, imageUrl, size }) {
    imageUrl = imageUrl || "user.png";
    console.log("props in Presentational: ", imageUrl);
    let profilelogo = "";
    let profilepic = "";
    if (size == "l") {
        profilelogo = "profilelogo";
        profilepic = "profilepic";
    } else if (size == "s") {
        profilelogo = "profilelogos";
        profilepic = "profilepics";
    }
    return (
        <div className={profilelogo}>
            <img src={imageUrl} className={profilepic} />{" "}
            <h4>
                {first} {last}
            </h4>
        </div>
    );
}
