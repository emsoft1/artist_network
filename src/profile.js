import React from "react";
import Profilepic from "./profilepic";
import Bioeditor from "./bioeditor";

export default function Profile(props) {
    console.log("Profile -> props", props);
    return (
        <div className="profilecenter">
            <div onClick={props.toggleModal} className="propicinpro">
                <Profilepic
                    first={props.first}
                    last={props.last}
                    imageUrl={props.imageUrl}
                    size="l"
                />
            </div>
            <div className="bioedi">
                <Bioeditor bio={props.bio} changeBio={props.changeBio} />
            </div>
        </div>
    );
}
