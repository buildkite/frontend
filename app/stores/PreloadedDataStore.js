import merge from 'deepmerge';

class PreloadedDataStore {
  get(key, property) {
    let data;
    let p = property ? property : (key.split("/")[0]);

    window._preload.forEach((payload) => {
      if(payload.key == key) {
        if(data) {
          data = merge(data, payload.data[p]);
        } else {
          data = payload.data[p];
        }
      }
    });

    return data;
  }
}

export default new PreloadedDataStore()
