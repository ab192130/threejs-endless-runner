import Loader from "../../utils/loader";
import resourceList from './resources/list';
import _ from 'lodash';

export default class Resources {
    constructor(props) {
        this.loader = new Loader(resourceList);
        this.items = this.loader.items;
    }

    get(name) {
        return _.get(this.items, name);
    }
}
