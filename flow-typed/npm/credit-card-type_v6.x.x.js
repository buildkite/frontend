// flow-typed signature: f516fbfb6f928296872da434c34cbb4d
// flow-typed version: bc9a27af09/credit-card-type_v6.x.x/flow_>=v0.25.x

declare module 'credit-card-type' {
  declare type ICardType = {
    niceType: string,
    type: string,
    prefixPattern: RegExp,
    exactPattern: RegExp,
    gaps: number[],
    lengths: number[],
    code: {
      name: string,
      size: number
    }
  }

  declare type ILibrary = {
    (cardNumber: string): ICardType[];
    types: {
      [key: string]: ICardType
    };
    getTypeInfo: (type: string) => ICardType | null;
    removeCard: (name: string) => void;
    addCard: (config: ICardType) => void;
    changeOrder: (name: string, position: number) => void;
    resetModifications: () => void;
  }

  declare module.exports: ILibrary
}
