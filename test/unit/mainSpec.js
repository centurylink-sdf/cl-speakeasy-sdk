define(['Utils'], function(Utils){
    describe("A spec to test Utils module" , function() {

      it("test isFunction method", function() {
        var foo =  function(){};
        var bar = 13;

        expect(Utils.isFunction(foo)).toBe(true);
        expect(Utils.isFunction(bar)).not.toBe(true);
      });

      it('test isValidUrl method', function(){
          var foo = 'http://google.com';
          var bar = '';

          expect(Utils.isValidUrl(foo)).toBe(true);
          expect(Utils.isValidUrl(bar)).not.toBe(true);
      });

      it('test encodeParams method', function(){
          var foo = {
            foo: 'value1',
            bar: 'value2'
          };

          var bar = {};

          expect(Utils.encodeParams(foo)).toEqual('foo=value1&bar=value2');
          expect(Utils.encodeParams(bar)).toEqual('');
      });

      it('test set and get methods together', function(){
          var key = 'spec';
          var value = ' test';

          Utils.set(key, value);

          expect(Utils.get(key)).toEqual(value);
      });

    });
});
