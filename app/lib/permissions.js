import update from "react-addons-update";

class PermissionManager {
  constructor(permissions) {
    if (!permissions) {
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
    const thisPermissionAllowed = this.find(key).allowed;
    let othersAllowed = false;

    // Check to see if one of the other permissions is allowed
    for (const name in this.permissions) {
      if (name !== key && this.find(name).allowed) {
        othersAllowed = true;
      }
    }

    return thisPermissionAllowed && !othersAllowed;
  }

  // Returns true if _any_ of the permissions in the hash are allowed -
  // otherwise returns false.
  areAnyPermissionsAllowed() {
    for (const name in this.permissions) {
      if (this.find(name).allowed) {
        return true;
      }
    }

    return false;
  }

  // Returns true if _all of the permissions in the hash are allowed -
  // otherwise returns false.
  areAllPermissionsAllowed() {
    for (const name in this.permissions) {
      if (!this.find(name).allowed) {
        return false;
      }
    }

    return true;
  }

  check(config, args) {
    args = args || [];

    // Along with checking a paticular permission, you can also pass an `and` config, i.e.
    //
    //      {
    //        allowed: "organizationUpdate",
    //        and: Features.SSOSettings,
    //        render: (idx) => (
    //          <Menu.Button key={idx} link={`/organizations/${this.props.organization.slug}/sso`}>
    //            <Icon icon="sso" className="icon-mr"/>SSO
    //          </Menu.Button>
    //        )
    //      },
    //
    // `and` can either be a boolean value, or a function.
    if (config.and !== undefined) {
      if (typeof(config.and) == 'function') {
        if (!config.and()) {
          return null;
        }
      } else {
        if (!config.and) {
          return null;
        }
      }
    }

    if (config.always) {
      return config.render(...args);
    } else if (config.all) {
      if (this.areAllPermissionsAllowed()) {return config.render(...args);}
    } else if (config.allowed) {
      if (this.isPermissionAllowed(config.allowed)) {return config.render(...args);}
    } else if (config.any) {
      if (this.areAnyPermissionsAllowed()) {return config.render(...args);}
    } else if (config.only) {
      if (this.isPermissionOnlyOneAllowed(config.only)) {return config.render(...args);}
    } else {
      throw new Error('Missing permission config attribute. Must be either `always`, `all`, `allowed`, `any` or `only`');
    }

    return null;
  }

  // Returns the result of the first permission that's allowed
  first() {
    const args = [].slice.call(arguments);
    for (const config of args) {
      const result = this.check(config);

      if (result) {return config.render();}
    }

    return null;
  }

  // Loops through the arguments, and collects the results of each check. The
  // resulting array has all null values removed.
  collect() {
    const args = [].slice.call(arguments);
    const results = [];
    for (const idx in args) {
      const config = args[idx];
      const result = this.check(config, idx);

      if (result) {results.push(result);}
    }

    return results;
  }

  find(key) {
    const result = this.permissions[key];

    // Ensure sure the permission is even there
    if (!result) {
      throw new Error('Missing permission "' + key + '"', this.permissions);
    }

    // Validate that the 'allowed' key is present
    if (result.allowed === undefined) {
      throw new Error('Missing `allowed` property for "' + key + '" permission');
    }

    return result;
  }
}

export default (permissions) => { return new PermissionManager(permissions); };
