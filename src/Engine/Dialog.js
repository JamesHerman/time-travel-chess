import React from 'react'
import './Dialog.css'

class Dialog extends React.Component {
    render() {
        return(
            <div className="dialog">
                {this.props.text}
                <br/>
                {this.renderButtons()}
            </div>
        )
    }

    renderButtons() {
        if (this.props.response) {
            return(
                <div className="row-flex">
                    <button onClick={() => {this.props.dismiss(); this.props.response(true)}}>Yes</button>
                    <button onClick={() => {this.props.dismiss();this.props.response(false)}}>No</button>
                </div>
            )
        }
        else {
            return(
                <button onClick={() => this.props.dismiss()}>Ok</button>
            )
        }
    }
}

export default Dialog;