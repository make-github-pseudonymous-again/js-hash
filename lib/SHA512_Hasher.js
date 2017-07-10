'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SHA512_Hasher = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sha = require('./sha512');

var _jsArray = require('@aureooms/js-array');

var _jsError = require('@aureooms/js-error');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SHA512_Hasher = exports.SHA512_Hasher = function () {
	function SHA512_Hasher() {
		_classCallCheck(this, SHA512_Hasher);

		this.state = (0, _sha.sha512_initial_state)();
		this.total_bits = 0;
		this.buffer = new ArrayBuffer(128);
		this.buffer_bits = 0;
	}

	_createClass(SHA512_Hasher, [{
		key: 'update',
		value: function update(bytes) {
			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : bytes.length - offset;


			if (this.buffer_bits & 0xFFF !== 0) {
				throw (0, _jsError.NotImplementedError)('Cannot add bytes to bits (for now).');
			}

			this.total_bits += length << 3;

			var buffer_bytes = this.buffer_bits >> 3;

			if (buffer_bytes > 0) {

				var buffer_complement = 128 - buffer_bytes;

				if (length < buffer_complement) {
					// buffer is not full
					(0, _jsArray.copy)(bytes, offset, offset + length, this.buffer, buffer_bytes);
					this.buffer_bits += length << 3;
					return;
				} else {
					// pad buffer with head of bytes and process it
					(0, _jsArray.copy)(bytes, offset, offset + buffer_complement, this.buffer, buffer_bytes);
					(0, _sha.sha512_call)(this.state, this.buffer, 0);
					this.buffer_bits = 0;
					offset += buffer_complement;
					length -= buffer_complement;
				}
			}

			var full_blocks = length >> 7;

			for (var i = 0; i < full_blocks; ++i) {
				(0, _sha.sha512_call)(this.state, bytes, offset);
				offset += 128;
				length -= 128;
			}

			(0, _jsArray.copy)(bytes, offset, offset + length, this.buffer, 0);
			this.buffer_bits = length << 3;
		}
	}, {
		key: 'digest',
		value: function digest() {
			var digest = new ArrayBuffer(64);
			return sha512_finalize(this.buffer, this.total_bits, digest, this.buffer_bits >> 3, 0, this.buffer_bits, this.state);
		}
	}]);

	return SHA512_Hasher;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TSEE1MTJfSGFzaGVyLmpzIl0sIm5hbWVzIjpbIlNIQTUxMl9IYXNoZXIiLCJzdGF0ZSIsInRvdGFsX2JpdHMiLCJidWZmZXIiLCJBcnJheUJ1ZmZlciIsImJ1ZmZlcl9iaXRzIiwiYnl0ZXMiLCJvZmZzZXQiLCJsZW5ndGgiLCJidWZmZXJfYnl0ZXMiLCJidWZmZXJfY29tcGxlbWVudCIsImZ1bGxfYmxvY2tzIiwiaSIsImRpZ2VzdCIsInNoYTUxMl9maW5hbGl6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7Ozs7SUFFYUEsYSxXQUFBQSxhO0FBRVosMEJBQWdCO0FBQUE7O0FBRWYsT0FBS0MsS0FBTCxHQUFhLGdDQUFiO0FBQ0EsT0FBS0MsVUFBTCxHQUFrQixDQUFsQjtBQUNBLE9BQUtDLE1BQUwsR0FBYyxJQUFJQyxXQUFKLENBQWdCLEdBQWhCLENBQWQ7QUFDQSxPQUFLQyxXQUFMLEdBQW1CLENBQW5CO0FBRUE7Ozs7eUJBRVFDLEssRUFBc0Q7QUFBQSxPQUE5Q0MsTUFBOEMsdUVBQXJDLENBQXFDO0FBQUEsT0FBakNDLE1BQWlDLHVFQUF4QkYsTUFBTUUsTUFBTixHQUFlRCxNQUFTOzs7QUFFOUQsT0FBSyxLQUFLRixXQUFMLEdBQW1CLFVBQVUsQ0FBbEMsRUFBc0M7QUFDckMsVUFBTSxrQ0FBb0IscUNBQXBCLENBQU47QUFDQTs7QUFFRCxRQUFLSCxVQUFMLElBQW1CTSxVQUFVLENBQTdCOztBQUVBLE9BQU1DLGVBQWUsS0FBS0osV0FBTCxJQUFvQixDQUF6Qzs7QUFFQSxPQUFLSSxlQUFlLENBQXBCLEVBQXdCOztBQUV2QixRQUFNQyxvQkFBb0IsTUFBTUQsWUFBaEM7O0FBRUEsUUFBS0QsU0FBU0UsaUJBQWQsRUFBa0M7QUFDakM7QUFDQSx3QkFBTUosS0FBTixFQUFjQyxNQUFkLEVBQXVCQSxTQUFTQyxNQUFoQyxFQUF5QyxLQUFLTCxNQUE5QyxFQUF1RE0sWUFBdkQ7QUFDQSxVQUFLSixXQUFMLElBQW9CRyxVQUFVLENBQTlCO0FBQ0E7QUFDQSxLQUxELE1BT0s7QUFDSjtBQUNBLHdCQUFNRixLQUFOLEVBQWNDLE1BQWQsRUFBdUJBLFNBQVNHLGlCQUFoQyxFQUFvRCxLQUFLUCxNQUF6RCxFQUFrRU0sWUFBbEU7QUFDQSwyQkFBWSxLQUFLUixLQUFqQixFQUF3QixLQUFLRSxNQUE3QixFQUFxQyxDQUFyQztBQUNBLFVBQUtFLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQUUsZUFBVUcsaUJBQVY7QUFDQUYsZUFBVUUsaUJBQVY7QUFDQTtBQUVEOztBQUVELE9BQU1DLGNBQWNILFVBQVUsQ0FBOUI7O0FBRUEsUUFBTSxJQUFJSSxJQUFJLENBQWQsRUFBa0JBLElBQUlELFdBQXRCLEVBQW9DLEVBQUVDLENBQXRDLEVBQTBDO0FBQ3pDLDBCQUFZLEtBQUtYLEtBQWpCLEVBQXdCSyxLQUF4QixFQUErQkMsTUFBL0I7QUFDQUEsY0FBVSxHQUFWO0FBQ0FDLGNBQVUsR0FBVjtBQUNBOztBQUVELHNCQUFNRixLQUFOLEVBQWNDLE1BQWQsRUFBdUJBLFNBQVNDLE1BQWhDLEVBQXlDLEtBQUtMLE1BQTlDLEVBQXVELENBQXZEO0FBQ0EsUUFBS0UsV0FBTCxHQUFtQkcsVUFBVSxDQUE3QjtBQUVBOzs7MkJBRVU7QUFDVixPQUFNSyxTQUFTLElBQUlULFdBQUosQ0FBZ0IsRUFBaEIsQ0FBZjtBQUNBLFVBQU9VLGdCQUFnQixLQUFLWCxNQUFyQixFQUE2QixLQUFLRCxVQUFsQyxFQUE4Q1csTUFBOUMsRUFBc0QsS0FBS1IsV0FBTCxJQUFvQixDQUExRSxFQUE2RSxDQUE3RSxFQUFnRixLQUFLQSxXQUFyRixFQUFrRyxLQUFLSixLQUF2RyxDQUFQO0FBQ0EiLCJmaWxlIjoiU0hBNTEyX0hhc2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNoYTUxMl9pbml0aWFsX3N0YXRlICwgc2hhNTEyX2NhbGwgfSBmcm9tICcuL3NoYTUxMicgO1xuXG5pbXBvcnQgeyBjb3B5IH0gZnJvbSAnQGF1cmVvb21zL2pzLWFycmF5JyA7XG5pbXBvcnQgeyBOb3RJbXBsZW1lbnRlZEVycm9yIH0gZnJvbSAnQGF1cmVvb21zL2pzLWVycm9yJyA7XG5cbmV4cG9ydCBjbGFzcyBTSEE1MTJfSGFzaGVyIHtcblxuXHRjb25zdHJ1Y3RvciAoICkge1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHNoYTUxMl9pbml0aWFsX3N0YXRlKCkgO1xuXHRcdHRoaXMudG90YWxfYml0cyA9IDAgO1xuXHRcdHRoaXMuYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEyOCkgO1xuXHRcdHRoaXMuYnVmZmVyX2JpdHMgPSAwIDtcblxuXHR9XG5cblx0dXBkYXRlICggYnl0ZXMgLCBvZmZzZXQgPSAwICwgbGVuZ3RoID0gYnl0ZXMubGVuZ3RoIC0gb2Zmc2V0ICkge1xuXG5cdFx0aWYgKCB0aGlzLmJ1ZmZlcl9iaXRzICYgMHhGRkYgIT09IDAgKSB7XG5cdFx0XHR0aHJvdyBOb3RJbXBsZW1lbnRlZEVycm9yKCdDYW5ub3QgYWRkIGJ5dGVzIHRvIGJpdHMgKGZvciBub3cpLicpIDtcblx0XHR9XG5cblx0XHR0aGlzLnRvdGFsX2JpdHMgKz0gbGVuZ3RoIDw8IDMgO1xuXG5cdFx0Y29uc3QgYnVmZmVyX2J5dGVzID0gdGhpcy5idWZmZXJfYml0cyA+PiAzIDtcblxuXHRcdGlmICggYnVmZmVyX2J5dGVzID4gMCApIHtcblxuXHRcdFx0Y29uc3QgYnVmZmVyX2NvbXBsZW1lbnQgPSAxMjggLSBidWZmZXJfYnl0ZXMgO1xuXG5cdFx0XHRpZiAoIGxlbmd0aCA8IGJ1ZmZlcl9jb21wbGVtZW50ICkge1xuXHRcdFx0XHQvLyBidWZmZXIgaXMgbm90IGZ1bGxcblx0XHRcdFx0Y29weSggYnl0ZXMgLCBvZmZzZXQgLCBvZmZzZXQgKyBsZW5ndGggLCB0aGlzLmJ1ZmZlciAsIGJ1ZmZlcl9ieXRlcyApIDtcblx0XHRcdFx0dGhpcy5idWZmZXJfYml0cyArPSBsZW5ndGggPDwgMyA7XG5cdFx0XHRcdHJldHVybiA7XG5cdFx0XHR9XG5cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBwYWQgYnVmZmVyIHdpdGggaGVhZCBvZiBieXRlcyBhbmQgcHJvY2VzcyBpdFxuXHRcdFx0XHRjb3B5KCBieXRlcyAsIG9mZnNldCAsIG9mZnNldCArIGJ1ZmZlcl9jb21wbGVtZW50ICwgdGhpcy5idWZmZXIgLCBidWZmZXJfYnl0ZXMgKSA7XG5cdFx0XHRcdHNoYTUxMl9jYWxsKHRoaXMuc3RhdGUsIHRoaXMuYnVmZmVyLCAwKTtcblx0XHRcdFx0dGhpcy5idWZmZXJfYml0cyA9IDAgO1xuXHRcdFx0XHRvZmZzZXQgKz0gYnVmZmVyX2NvbXBsZW1lbnQgO1xuXHRcdFx0XHRsZW5ndGggLT0gYnVmZmVyX2NvbXBsZW1lbnQgO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Y29uc3QgZnVsbF9ibG9ja3MgPSBsZW5ndGggPj4gNyA7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDAgOyBpIDwgZnVsbF9ibG9ja3MgOyArK2kgKSB7XG5cdFx0XHRzaGE1MTJfY2FsbCh0aGlzLnN0YXRlLCBieXRlcywgb2Zmc2V0KTtcblx0XHRcdG9mZnNldCArPSAxMjggO1xuXHRcdFx0bGVuZ3RoIC09IDEyOCA7XG5cdFx0fVxuXG5cdFx0Y29weSggYnl0ZXMgLCBvZmZzZXQgLCBvZmZzZXQgKyBsZW5ndGggLCB0aGlzLmJ1ZmZlciAsIDAgKSA7XG5cdFx0dGhpcy5idWZmZXJfYml0cyA9IGxlbmd0aCA8PCAzIDtcblxuXHR9XG5cblx0ZGlnZXN0ICggKSB7XG5cdFx0Y29uc3QgZGlnZXN0ID0gbmV3IEFycmF5QnVmZmVyKDY0KTtcblx0XHRyZXR1cm4gc2hhNTEyX2ZpbmFsaXplKHRoaXMuYnVmZmVyLCB0aGlzLnRvdGFsX2JpdHMsIGRpZ2VzdCwgdGhpcy5idWZmZXJfYml0cyA+PiAzLCAwLCB0aGlzLmJ1ZmZlcl9iaXRzLCB0aGlzLnN0YXRlKTtcblx0fVxuXG59XG4iXX0=