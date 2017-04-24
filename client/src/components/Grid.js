import React, { Component } from 'react';
import Masonry from 'react-masonry-component';

export default class Grid extends Component {
    render() {
        return <div className="row">
            <Masonry>
                {this.props.data.map((item, index) => <div className="col-md-1 mb" key={index}>{this.props.children(item)}</div>)}
            </Masonry>
        </div>;
    }
}