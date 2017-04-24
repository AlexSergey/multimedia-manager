import React, { Component } from 'react';

export default class Pagination extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var pages = Math.ceil(this.props.total / this.props.size);
        var isPage = true;

        return <nav>
            <ul className="pagination">
                {pages >= 0 ? Array.apply(null, Array(pages)).map((item, index) => {
                    var li = <li className={index === this.props.offset  ? 'active' : ''} key={index}><a href="#" onClick={e => {
                        e.preventDefault();
                        this.props.onClick(e);
                    }} data-offset={index}>{index + 1}</a></li>;

                    if (index !== 0 && (index + 1) !== pages) {
                        if (index < this.props.offset - 2 || index >= this.props.offset + 3) {
                            li = null;
                        }
                    }

                    return li;
                })
                .filter(item => {
                    if (!item) {
                        if (isPage) {
                            isPage = false;
                            return true;
                        }
                        return false;
                    }
                    isPage = true;
                    return true;
                })
                .map((page, index) => !page ? <li key={`double-${index}`}><span>...</span></li> : page): null}
            </ul>
        </nav>;
    }
}