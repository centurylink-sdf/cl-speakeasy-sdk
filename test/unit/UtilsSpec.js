define(['Utils'], function(Utils){
    describe("A spec to test Utils module" , function() {

      it("isFunction should return true if argument is function", function() {
        var foo =  function(){};
        var bar = 13;

        expect(Utils.isFunction(foo)).toBe(true);
        expect(Utils.isFunction(bar)).not.toBe(true);
      });

      it('isValidUrl should return true if url is valid', function(){
          var foo = 'http://google.com';
          var bar = '';

          expect(Utils.isValidUrl(foo)).toBe(true);
          expect(Utils.isValidUrl(bar)).not.toBe(true);
      });

      it('encodeParams should return encoded string', function(){
          var foo = {
            foo: 'value1',
            bar: 'value2'
          };

          var bar = {};

          expect(Utils.encodeParams(foo)).toEqual('foo=value1&bar=value2');
          expect(Utils.encodeParams(bar)).toEqual('');
      });

      it('should set item to localStorage and get it from there', function(){
          var key = 'spec';
          var value = ' test';

          Utils.set(key, value);

          expect(Utils.get(key)).toEqual(value);
      });

    });
});
