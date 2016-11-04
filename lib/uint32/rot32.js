"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rot32 = rot32;
/**
 * Left rotate for 32-bit unsigned integers
 *
 *  - used in md5 and sha1
 */

function rot32(word, shift) {
  return word << shift | word >>> 32 - shift;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aW50MzIvcm90MzIuanMiXSwibmFtZXMiOlsicm90MzIiLCJ3b3JkIiwic2hpZnQiXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCQSxLLEdBQUFBLEs7QUFOaEI7Ozs7OztBQU1PLFNBQVNBLEtBQVQsQ0FBZ0JDLElBQWhCLEVBQXNCQyxLQUF0QixFQUE2QjtBQUNuQyxTQUFRRCxRQUFRQyxLQUFULEdBQW1CRCxTQUFVLEtBQUtDLEtBQXpDO0FBQ0EiLCJmaWxlIjoicm90MzIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIExlZnQgcm90YXRlIGZvciAzMi1iaXQgdW5zaWduZWQgaW50ZWdlcnNcbiAqXG4gKiAgLSB1c2VkIGluIG1kNSBhbmQgc2hhMVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiByb3QzMiAod29yZCwgc2hpZnQpIHtcblx0cmV0dXJuICh3b3JkIDw8IHNoaWZ0KSB8ICh3b3JkID4+PiAoMzIgLSBzaGlmdCkpO1xufVxuIl19