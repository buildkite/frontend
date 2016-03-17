import update from "react-addons-update";

class PermissionManager {
  constructor(permissions) {
    if(!permissions) {
      throw new Error("Missing permission hash");
    }

    // Remove the hidden __dataID__ from the permissions object (which comes
    // from Relay)
    this.permissions = update(permissions, {});
    delete this.permissions.__dataID__;
  }

  // Returns true if a specific permission is allowed
  isPermissionAllowed(key) {
    return this.find(key).allowed;
  }

  // Returns true if this permission is the only one that's allowed
  isPermissionOnlyOneAllowed(key) {
    let thisPermissionAllowed = this.find(key).allowed;
    let othersAllowed = false;

    // Check to see if one of the other permissions is allowed
    for(let name in this.permissions) {
      if(name != key && this.find(name).allowed) {
        othersAllowed = true;
      }
    }

    return thisPermissionAllowed && !othersAllowed;
  }

  // Returns true if _any_ of the permissions in the hash are allowed -
  // otherwise returns false.
  areAnyPermissionsAllowed() {
    for(let name in this.permissions) {
      if(this.find(name).allowed) {
        return true
      }
    }

    return false;
  }

  // Returns true if _all of the permissions in the hash are allowed -
  // otherwise returns false.
  areAllPermissionsAllowed() {
    for(let name in this.permissions) {
      if(!this.find(name).allowed) {
        return false
      }
    }

    return true;
  }

  check(config, args) {
    args = args || [];

    if(config.all) {
      if(this.areAllPermissionsAllowed()) return config.render(...args);
    } else if(config.allowed) {
      if(this.isPermissionAllowed(config.allowed)) return config.render(...args);
    } else if(config.any) {
      if(this.areAnyPermissionsAllowed()) return config.render(...args);
    } else if(config.only) {
      if(this.isPermissionOnlyOneAllowed(config.only)) return config.render(...args);
    } else {
      throw new Error('Missing permission config attribute. Must be either `all`, `allowed`, `any` or `only`');
    }

    return null;
  }

  // Returns the result of the first permission that's allowed
  first() {
    let args = [].slice.call(arguments);
    for(let config of args) {
      let result = this.check(config);

      if(result) return config.render();
    }

    return null;
  }

  // Loops through the arguments, and collects the results of each check. The
  // resulting array has all null values removed.
  collect() {
    let args = [].slice.call(arguments);
    let results = [];
    for(let idx in args) {
      let config = args[idx];
      let result = this.check(config, idx);

      if(result) results.push(result);
    }

    return results;
  }

  find(key) {
    let result = this.permissions[key]

    // Ensure sure the permission is even there
    if(!result) {
      throw new Error('Missing permission "' + key + '"', this.permissions);
    }

    // Validate that the 'allowed' key is present
    if(result.allowed == undefined) {
      throw new Error('Missing `allowed` property for "' + key + '" permission');
    }

    return result;
  }
}

export default (permissions) => { return new PermissionManager(permissions) }
