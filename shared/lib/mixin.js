/* eslint prefer-rest-params: 1 */
export default function (Parent /* , ...mixins*/) {
  // Use slice as node 4 does not support param spread.
  const mixins = Array.prototype.slice.call(arguments, 1);
  class Mixed extends Parent {}
  Object.values(mixins).forEach((mixin) => {
    Object.keys(mixin).forEach((prop) => {
      Mixed.prototype[prop] = mixin[prop];
    });
  });
  return Mixed;
}
