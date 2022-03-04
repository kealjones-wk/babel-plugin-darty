import * as BabelTypes from "@babel/types";
import { Visitor } from "@babel/traverse";
interface Babel {
  types: typeof BabelTypes;
}
export default function dartyPlugin({ types: t }: Babel): {
  name: string;
  visitor: Visitor<{}>;
};
export {};
