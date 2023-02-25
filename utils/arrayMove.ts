import { ImageProps } from "./types";

export default async function arrayMove(
  arr: ImageProps[],
  fromIndex: number,
  toIndex: number
) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
