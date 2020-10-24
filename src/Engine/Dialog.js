import { ReactComponent } from '*.svg';
import React from 'react'

class Dialog extends ReactComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="dialog">
                <div>{this.props.text}</div>
            </div>
        )
    }
}