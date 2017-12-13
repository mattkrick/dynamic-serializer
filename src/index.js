const isEmpty = (val) => val === undefined || val === null || val === '';

export default class DynamicSerializer {
  constructor() {
    this._counter = 0;
    this._cache = {};
    this._constant = false;
  }

  _cacheVal(arrVal) {
    if (this._cache.hasOwnProperty(arrVal)) {
      return this._cache[arrVal];
    }
    return this._cache[arrVal] = this._constant ? '<<constant>>' : this._counter++;
  }

  _visitArray(snapshot, path) {
    const nextProp = path[0];
    const arrVal = snapshot[nextProp];
    if (isFinite(nextProp)) {
      if (path.length > 1) {
        this._visitSnapshot(arrVal, path.slice(1));
      } else if (!isEmpty(arrVal)) {
        snapshot[nextProp] = this._cacheVal(arrVal);
      }
    } else {
      for (let i = 0; i < snapshot.length; i++) {
        const arrVal = snapshot[i];
        this._visitSnapshot(arrVal, path);
      }
    }
  }

  _visitObject(snapshot, path) {
    const nextLayer = path[0];
    if (!snapshot.hasOwnProperty(nextLayer)) return;
    if (path.length > 1) {
      this._visitSnapshot(snapshot[nextLayer], path.slice(1));
      return;
    }
    const oldVal = snapshot[nextLayer];
    if (isEmpty(oldVal)) return;
    if (Array.isArray(oldVal)) {
      for (let i = 0; i < oldVal.length; i++) {
        if (!isEmpty(oldVal[i])) {
          oldVal[i] = this._cacheVal(oldVal[i]);
        }
      }
    } else {
      snapshot[nextLayer] = this._cacheVal(oldVal);
    }
  }

  _visitSnapshot(snapshot, path) {
    if (Array.isArray(snapshot)) {
      this._visitArray(snapshot, path);
    } else if (snapshot) {
      this._visitObject(snapshot, path);
    }
  }

  toStatic(snapshot, fullPaths, options = {}) {
    const {constant} = options;
    this._constant = constant;
    for (let i = 0; i < fullPaths.length; i++) {
      const uid = fullPaths[i];
      const path = uid.split('.');
      this._visitSnapshot(snapshot, path);
    }
    this._constant = false;
    return snapshot;
  }
}
