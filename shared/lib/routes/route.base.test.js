/* global describe it expect*/

export default function testSharedRouteBehavior(route) {
  describe('shared Route behavior', () => {
    it('implements Route#assureData', () => {
      expect(typeof route.assureData).toEqual('function');
    });

    it('has a name', () => {
      expect(typeof route.route_name).toEqual('string');
    });
  });
}
