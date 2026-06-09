// This file contains custom emojis used in the bot. Each emoji is represented as an instance of the Emoji class, which provides a method to get the string representation of the emoji for use in messages.

class Emoji {
  name: string;
  id: string;
  animated?: boolean;

  constructor(name: string, id: string, animated?: boolean) {
    this.name = name;
    this.id = id;
    this.animated = animated;
  }

  getString() {
    return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
  }
}

export const CheckGreen = new Emoji('CheckGreen', '1510499766830759966');
export const ChevronDownRed = new Emoji('ChevronDownRed', '1510499787580117022');
export const ChevronLeft = new Emoji('ChevronLeft', '1510499786950836375');
export const ChevronRight = new Emoji('ChevronRight', '1510499786225221773');
export const ChevronUpGreen = new Emoji('ChevronUpGreen', '1510499785272983693');
export const Circle = new Emoji('Circle', '1510499784274739343');
export const CircleXRed = new Emoji('CircleXRed', '1510499783293538454');
export const CoinFlip = new Emoji('CoinFlip', '1510501036895371394', true);
export const Empty = new Emoji('Empty', '1510501105187160134');
export const Loading = new Emoji('Loading', '1510499873823260712', true);
export const MessageCircleQuestionMark = new Emoji('MessageCircleQuestionMark', '1510500702147973150');
export const RefreshCw = new Emoji('RefreshCw', '1510499782223859872');
export const Search = new Emoji('Search', '1510499781599035502');
export const UserRound = new Emoji('UserRound', '1510500706799583283');
export const X = new Emoji('X', '1510499780445339760');
export const XRed = new Emoji('XRed', '1510499779816456284');