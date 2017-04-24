import React, { Component } from 'react';
import { connect } from 'react-redux';
import {GET_PHOTOS} from './actions';
import Grid from '../../components/Grid';
import { getPhotos, sortByColor, resetFilters, getCategories, getCameras, searchByAll } from './services';
import { SketchPicker } from 'react-color';
import Pagination from '../../components/Pagination';
import Select from 'react-select';

const SEARCH_FIELDS = [
    'camera_model_name',
    'category'
];

class Photos extends Component {
    constructor(props) {
        super(props);

        this.reset = this.reset.bind(this);
        this.search = this.search.bind(this);
        this.searchByAll = this.searchByAll.bind(this);
        this.timeout = {};

        this.state = {
            field: '',
            cameras: [{value: '*', label: 'all'}],
            categories: [{value: '*', label: 'all'}],
            camera: '*',
            category: '*',
            color: '#fff',
            offset: this.props.offset
        };
    }
    componentDidMount() {
        getCategories()
            .then(data => this.setState({
                categories: this.state.categories.slice()
                    .concat(data.data.collection.map(category => ({value: category, label: category})))
            }));
        getCameras()
            .then(data => this.setState({
                cameras: this.state.cameras.slice()
                    .concat(data.data.collection.map(camera => ({value: camera, label: camera})))
            }));

        this.props.getPhotos('*', this.props.size, this.props.offset);
    }

    handleChangeComplete(color) {
        this.setState({ color: color.hex }, () => this.props.sortByColor(color.rgb, this.props.size, this.props.offset));
    }

    reset(e) {
        e.preventDefault();
        this.setState({ color: '#fff', camera: '*', category: '*' }, () => this.props.resetFilters(this.props.size, this.props.offset));
    }

    search() {
        var _q = [this.state.camera, this.state.category]
            .map((item, index) => {
                var result = {};
                result[SEARCH_FIELDS[index]] = item;
                return result;
            })
            .filter(item => {
                var value = item[Object.keys(item)[0]];
                return value !== '*' && value !== '';
            })
            .reduce((prev, curr) => {
                return Object.assign(prev, curr);
            }, {});
        var q = Object.keys(_q).length === 0 ? '*' : serialize(_q);

        this.props.getPhotos(q, this.props.size, this.props.offset);
    }

    searchByAll() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (this.state.field === '') {
                return this.props.getPhotos('*', this.props.size, this.props.offset);
            }
            return this.props.getPhotos(`_all:${this.state.field}`, this.props.size, this.props.offset);
        }, 1000);
    }

    render() {
        return <div>
            <div className="jumbotron">
                <div className="container">
                    Photos:
                </div>
            </div>
            <div className="row">
                <form className="navbar-form" role="search">
                    <div className="form-group">
                        <input type="text" value={this.state.field} className="form-control" placeholder="Search by name" onChange={(e) => this.setState({field: e.target.value}, this.searchByAll)} />
                    </div>

                    <Select
                        name="categories"
                        value={this.state.category}
                        options={this.state.categories}
                        onChange={(t) => this.setState({
                            category: t.value
                        }, this.search)}
                    />
                    <Select
                        name="cameras"
                        value={this.state.camera}
                        options={this.state.cameras}
                        onChange={(t) => this.setState({
                            camera: t.value
                        }, this.search)}
                    />
                    <hr />
                    <h2>Find by color</h2>
                    <SketchPicker color={ this.state.color } onChangeComplete={ this.handleChangeComplete }></SketchPicker>
                    <button  className="btn btn-default" onClick={this.reset}>Reset Filters</button>
                </form>
            </div>

            <Grid data={this.props.photos}>
                {item => <img style={{width: '100px'}} src={(`http://localhost:3200/photos/${item.category}/${item.file_name}`)} alt=""/>}
            </Grid>

            <Pagination offset={this.state.offset} size={this.props.size} total={this.props.total} onClick={(e) => {
                var offset = parseInt(e.target.dataset.offset);

                this.setState({
                    offset
                }, () => {
                    this.props.getPhotos(this.props.size, offset);
                });
            }} />
        </div>
    }
}

var serialize = function(obj, prefix) {
    var str = [], p;
    for(p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};

function prettifyData(promise) {
    return promise
        .then(data => ({
            photos: data.hits.hits,
            total: data.hits.total,
            size: data.size,
            offset: data.offset
        }))
}

export default connect(state => ({
    photos: state.photos.photos,
    offset: state.photos.offset,
    total: state.photos.total,
    size: state.photos.size
}), dispatch => ({
    getPhotos: (query, size, offset) => prettifyData(getPhotos(query, size, offset)).then(data => dispatch(GET_PHOTOS(data))),
    resetFilters: (size, offset) => prettifyData(resetFilters(size, offset)).then(data => dispatch(GET_PHOTOS(data))),
    sortByColor: (color, size, offset) => prettifyData(sortByColor(color, size, offset)).then(data => dispatch(GET_PHOTOS(data)))
}))(Photos)
