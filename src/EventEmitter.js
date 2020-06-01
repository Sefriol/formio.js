import { EventEmitter } from 'eventemitter3';
import * as utils from './utils/utils';

export default class Events extends EventEmitter {
  constructor(conf = {}) {
    const { loadLimit = 1000, eventsSafeInterval = 300, ...ee2conf } = conf;
    super(ee2conf);

    const overloadHandler = () => {
      console.warn(`There were more than ${loadLimit} events emitted in ${eventsSafeInterval} ms. It might be caused by events' infinite loop`, this.id);
    };

    const dispatch = utils.observeOverload(overloadHandler, {
      limit: loadLimit,
      delay: eventsSafeInterval
    });

    this.emit = (...args) => {
      super.emit(...args);
      dispatch();
    };
  }
}
