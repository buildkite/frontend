// @flow

import { interpolateQuery, findQueryOperationNames } from "./query";
import { DEFAULT_QUERY_WITH_ORGANIZATION, DEFAULT_QUERY_NO_ORGANIZATION } from "./defaults";

const LOCAL_STORAGE_KEY = "GraphQLExplorer.consoleState";

class ConsoleState {
  query: string;
  operationName: string;
  results: { output: string, performance: string };

  constructor() {
    this.loadFromLocalStorage();
  }

  setOrganizationEdges(organizationEdges: Array) {
    this.organizationEdges = organizationEdges;
  }

  setResults(output: string, performance: string) {
    this.results = {
      output: output,
      performance: performance
    };

    return { results: this.results };
  }

  setQuery(query: string): { allOperationNames: Array<string> } {
    this.query = query;
    this.saveToLocalStorage();

    return {
      query: query,
      allOperationNames: this.getAllOperationNames(),
      currentOperationName: this.getCurrentOperationName()
    };
  }

  getQuery(): string {
    // If there's no query loaded, make one up.
    if (!this.query) {
      // If we've got an organization loaded, let's use the default query that
      // looks at the first organization. If the user isn't part of any
      // organization, we'll use the default that doesn't retrieve organization
      // information.
      if (this.organizationEdges.length) {
        this.query = interpolateQuery(DEFAULT_QUERY_WITH_ORGANIZATION, {
          organization: this.organizationEdges[0].node
        });
      } else {
        this.query = DEFAULT_QUERY_NO_ORGANIZATION;
      }
    }

    return this.query;
  }

  setCurrentOperationName(operationName: string): { currentOperationName: string } {
    this.currentOperationName = operationName;
    this.saveToLocalStorage();

    return { currentOperationName: this.getCurrentOperationName() };
  }

  getCurrentOperationName() {
    const currentOperationName = this.currentOperationName;
    const allOperationNames = this.getAllOperationNames();

    if (currentOperationName && allOperationNames && allOperationNames.indexOf(currentOperationName) >= 0) {
      this.currentOperationName = currentOperationName; // No change
    } else if (allOperationNames && allOperationNames.length) {
      this.currentOperationName = allOperationNames[0]; // Use the first one
    } else {
      this.currentOperationName = null; // No operations available
    }

    return this.currentOperationName;
  }

  getAllOperationNames() {
    const allOperationNames = findQueryOperationNames(this.getQuery());
    if (allOperationNames) {
      this.allOperationNames = allOperationNames;
    }

    return this.allOperationNames;
  }

  loadFromLocalStorage() {
    try {
      const payload = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

      this.query = payload.query;
      this.currentOperationName = payload.currentOperationName;
    } catch (exception) {
      // Meh, we tried...
    }
  }

  saveToLocalStorage() {
    const payload = {
      query: this.query,
      currentOperationName: this.currentOperationName
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  }

  toStateObject() {
    return {
      results: this.results,
      query: this.getQuery(),
      currentOperationName: this.getCurrentOperationName(),
      allOperationNames: this.getAllOperationNames()
    };
  }
}

export default new ConsoleState();
