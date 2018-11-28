// @flow

export const MockMakeFetch = () => {
    console.log(arguments)
    return jest.fn();
}